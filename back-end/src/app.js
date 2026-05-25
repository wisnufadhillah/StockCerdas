const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { apiRoutes } = require("./routes");
const { errorHandler, notFoundHandler } = require("./middleware/error-handler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "StockCerdas RESTful API berjalan",
    docs: {
      health: "/api/health",
      products: "/api/products",
      transactions: "/api/transactions",
      tenants: "/api/tenants",
      predictions: "/api/predictions",
    },
  });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
