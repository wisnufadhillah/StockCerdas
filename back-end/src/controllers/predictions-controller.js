const { pool } = require("../db/pool");
const { requestAiPrediction } = require("../services/ai-service");

function normalizePeriod(period) {
  const allowed = new Set(["7_days", "14_days", "30_days"]);
  return allowed.has(period) ? period : "7_days";
}

function calculateRisk(currentStock, predictedDemand) {
  if (currentStock <= 0 || currentStock < predictedDemand * 0.4) return "high";
  if (currentStock < predictedDemand) return "medium";
  return "low";
}

async function createPrediction(req, res) {
  const { product_id, forecast_period = "7_days", features } = req.body;

  if (!product_id) {
    res.status(400).json({ status: "fail", message: "product_id wajib diisi" });
    return;
  }

  const productResult = await pool.query("SELECT id, name, current_stock FROM products WHERE id = $1", [product_id]);

  if (!productResult.rowCount) {
    res.status(404).json({ status: "fail", message: "Produk tidak ditemukan" });
    return;
  }

  const product = productResult.rows[0];
  let aiRawResponse = null;
  let predictedDemand;

  try {
    aiRawResponse = await requestAiPrediction(features);
  } catch (error) {
    aiRawResponse = { warning: error.message };
  }

  if (aiRawResponse?.prediction_scaled !== undefined) {
    predictedDemand = Math.max(1, Math.round(Number(aiRawResponse.prediction_scaled) * 100));
  } else {
    const fallbackBase = forecast_period === "30_days" ? 52 : forecast_period === "14_days" ? 32 : 18;
    predictedDemand = Math.max(fallbackBase, Number(product.current_stock) + 8);
  }

  const currentStock = Number(product.current_stock);
  const recommendedRestock = Math.max(predictedDemand - currentStock, 0);
  const riskLevel = calculateRisk(currentStock, predictedDemand);
  const normalizedPeriod = normalizePeriod(forecast_period);

  const { store_id } = req.body;
  
  const result = await pool.query(
    `INSERT INTO predictions
      (product_id, store_id, forecast_period, predicted_demand, current_stock, recommended_restock, risk_level, ai_raw_response)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      product_id,
      store_id,
      normalizedPeriod,
      predictedDemand,
      currentStock,
      recommendedRestock,
      riskLevel,
      aiRawResponse || { mode: "fallback" },
    ]
  );

  res.status(201).json({
    status: "success",
    data: {
      product_id: product.id,
      product_name: product.name,
      forecast_period: normalizedPeriod,
      predicted_demand: predictedDemand,
      current_stock: currentStock,
      recommended_restock: recommendedRestock,
      risk_level: riskLevel,
      prediction: result.rows[0],
    },
  });
}

async function getPredictions(req, res) {
  const { store_id, tenant_id } = req.query;
  const params = [];
  const filters = [];

  if (store_id && store_id !== "undefined") {
    params.push(store_id);
    filters.push(`pr.store_id = $${params.length}`);
  }

  if (tenant_id && tenant_id !== "undefined") {
    params.push(tenant_id);
    filters.push(`p.tenant_id = $${params.length}`);
  }

  const filter = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await pool.query(
    `SELECT pr.*, p.name AS product_name, p.sku
     FROM predictions pr
     LEFT JOIN products p ON p.id = pr.product_id
     ${filter}
     ORDER BY pr.created_at DESC`,
    params
  );

  res.json({ status: "success", data: result.rows });
}

module.exports = { createPrediction, getPredictions };
