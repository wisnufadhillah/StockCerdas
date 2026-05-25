const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require("../controllers/transactions-controller");

const router = express.Router();

router.get("/", asyncHandler(getTransactions));
router.post("/", asyncHandler(createTransaction));
router.delete("/:id", asyncHandler(deleteTransaction));

module.exports = { transactionsRoutes: router };
