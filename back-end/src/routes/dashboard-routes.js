const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const {
  getUsers,
  getCategories,
  getImports,
  getReports,
  getStoreSettings,
  getSystemSettings,
  getSystemServices,
} = require("../controllers/dashboard-controller");

const router = express.Router();

router.get("/users", asyncHandler(getUsers));
router.get("/categories", asyncHandler(getCategories));
router.get("/imports", asyncHandler(getImports));
router.get("/reports", asyncHandler(getReports));
router.get("/store-settings", asyncHandler(getStoreSettings));
router.get("/system-settings", asyncHandler(getSystemSettings));
router.get("/system-services", asyncHandler(getSystemServices));

module.exports = { dashboardRoutes: router };
