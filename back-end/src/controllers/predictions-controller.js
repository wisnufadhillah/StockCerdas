const { pool } = require("../db/pool");
const { requestAiPrediction } = require("../services/ai-service");
const { generateRestockRecommendation } = require("../services/generative-ai-service");
const { recordAuditLog } = require("../services/audit-log-service");

function normalizePeriod(period) {
  const allowed = new Set(["7_days", "14_days", "30_days"]);
  return allowed.has(period) ? period : "7_days";
}

function calculateRisk(currentStock, predictedDemand) {
  if (currentStock <= 0 || currentStock < predictedDemand * 0.4) return "high";
  if (currentStock < predictedDemand) return "medium";
  return "low";
}

function buildFallbackFeatureVector(product, forecastPeriod) {
  const currentStock = Number(product.current_stock || 0);
  const price = Number(product.price || 15000);
  const minStock = Number(product.minimum_stock || 10);
  const month = new Date().getMonth() + 1;

  // AI Model expects MONTHLY data (retail_feature_engineered.csv)
  // Simulate realistic monthly sales based on current stock
  const monthlySalesEstimate = Math.max(30, currentStock * 3 + 10);
  const totalSales = price * monthlySalesEstimate; 
  const lag1 = monthlySalesEstimate;

  return [
    totalSales, // 1. Total_Sales
    price,      // 2. Avg_Sales
    0,          // 3. Discount_Rate
    2021,       // 4. Year (Locked to 2021 to prevent Neural Network blowout from unseen years)
    month,      // 5. Month
    Math.ceil(month / 3), // 6. Quarter
    lag1,       // 7. Lag_1
    lag1 * 0.9, // 8. Lag_2
    lag1 * 1.1, // 9. Lag_3
    lag1,       // 10. Rolling_Mean_3
    lag1,       // 11. Rolling_Mean_6
    minStock,   // 12. Safety_Stock
    minStock * 2, // 13. Reorder_Point
    currentStock + lag1, // 14. Stok_Awal
    currentStock, // 15. Stok_Akhir
    0,          // 16. Sales_Growth
    product.id % 50, // 17. Product_Encoded
    Math.sin((month * 2 * Math.PI) / 12), // 18. Month_Sin
    Math.cos((month * 2 * Math.PI) / 12)  // 19. Month_Cos
  ];
}

async function createPrediction(req, res) {
  const { product_id, forecast_period = "7_days", features } = req.body;

  if (!product_id) {
    res.status(400).json({ status: "fail", message: "product_id wajib diisi" });
    return;
  }

  const productResult = await pool.query("SELECT id, name, current_stock, price, minimum_stock FROM products WHERE id = $1", [product_id]);

  if (!productResult.rowCount) {
    res.status(404).json({ status: "fail", message: "Produk tidak ditemukan" });
    return;
  }

  const product = productResult.rows[0];
  let aiRawResponse = null;
  let predictedDemand;
  const normalizedPeriod = normalizePeriod(forecast_period);

  try {
    const aiFeatures = Array.isArray(features) && features.length > 0
      ? features
      : buildFallbackFeatureVector(product, normalizedPeriod);

    aiRawResponse = await requestAiPrediction(aiFeatures);
  } catch (error) {
    aiRawResponse = { warning: error.message };
  }

  if (typeof aiRawResponse?.prediction_quantity === "number") {
    // Model output is always a 30-day (1 month) prediction
    let monthlyPred = Math.max(1, Math.round(aiRawResponse.prediction_quantity));
    
    // Scale down to requested forecast_period
    if (normalizedPeriod === "7_days") {
      predictedDemand = Math.max(1, Math.round(monthlyPred * (7 / 30)));
    } else if (normalizedPeriod === "14_days") {
      predictedDemand = Math.max(1, Math.round(monthlyPred * (14 / 30)));
    } else {
      predictedDemand = monthlyPred;
    }
  } else {
    const fallbackBase = forecast_period === "30_days" ? 52 : forecast_period === "14_days" ? 32 : 18;
    predictedDemand = Math.max(fallbackBase, Number(product.current_stock) + 8);
  }

  const currentStock = Number(product.current_stock);
  const recommendedRestock = Math.max(predictedDemand - currentStock, 0);
  const riskLevel = calculateRisk(currentStock, predictedDemand);
  let generativeRecommendation = null;

  try {
    generativeRecommendation = await generateRestockRecommendation({
      productName: product.name,
      currentStock,
      predictedDemand,
      recommendedRestock,
      riskLevel,
      forecastPeriod: normalizedPeriod,
    });
  } catch (error) {
    generativeRecommendation = null;
  }

  const result = await pool.query(
    `INSERT INTO predictions
      (product_id, forecast_period, predicted_demand, current_stock, recommended_restock, risk_level, ai_raw_response)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      product_id,
      normalizedPeriod,
      predictedDemand,
      currentStock,
      recommendedRestock,
      riskLevel,
      {
        ...(aiRawResponse || { mode: "fallback" }),
        generative_recommendation: generativeRecommendation,
      },
    ]
  );

  await recordAuditLog(pool, {
    action: "prediction_created",
    entityType: "prediction",
    entityId: result.rows[0].id,
    metadata: { product_id: product.id, product_name: product.name, forecast_period: normalizedPeriod, risk_level: riskLevel },
  });

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
      generative_recommendation: generativeRecommendation,
      prediction: result.rows[0],
    },
  });
}

async function getPredictions(req, res) {
  const { tenant_id } = req.query;
  const params = [];
  const filters = [];

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
