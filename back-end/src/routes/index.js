const express = require("express");
const { productsRoutes } = require("./products-routes");
const { transactionsRoutes } = require("./transactions-routes");
const { predictionsRoutes } = require("./predictions-routes");
const { tenantsRoutes } = require("./tenants-routes");
const { dashboardRoutes } = require("./dashboard-routes");
const storesRoutes = require("./stores-routes");
const importRoutes = require("./import-routes");
const { authRoutes } = require("./auth-routes");
const categoriesRoutes = require("./categories-routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "success",
    service: "StockCerdas API",
    timestamp: new Date().toISOString(),
  });
});

router.use("/products", productsRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/predictions", predictionsRoutes);
router.use("/tenants", tenantsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/stores", storesRoutes);
router.use("/import", importRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoriesRoutes);

module.exports = { apiRoutes: router };
