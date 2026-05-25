const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const {
  createPrediction,
  getPredictions,
} = require("../controllers/predictions-controller");

const router = express.Router();

router.get("/", asyncHandler(getPredictions));
router.post("/", asyncHandler(createPrediction));

module.exports = { predictionsRoutes: router };
