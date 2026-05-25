const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
} = require("../controllers/tenants-controller");

const router = express.Router();

router.get("/", asyncHandler(getTenants));
router.post("/", asyncHandler(createTenant));
router.put("/:id", asyncHandler(updateTenant));
router.delete("/:id", asyncHandler(deleteTenant));

module.exports = { tenantsRoutes: router };
