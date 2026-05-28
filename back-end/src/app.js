const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const YAML = require("yamljs");
const { apiReference } = require("@scalar/express-api-reference");
const { apiRoutes } = require("./routes");
const { errorHandler, notFoundHandler } = require("./middleware/error-handler");

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, "../docs/openapi.yaml"));

app.use(
  "/reference",
  apiReference({
    theme: "purple",
    darkMode: true,
    customCss: `
      body { background-color: #111111 !important; color: #ffffff !important; }
      .scalar-app { background-color: #111111 !important; }
      .scalar-card { background-color: #1a1a1a !important; border-color: #333 !important; }
      * { color-scheme: dark !important; }
    `,
    spec: {
      content: swaggerDocument,
    },
  })
);

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
