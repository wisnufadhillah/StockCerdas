require("dotenv").config();

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000",
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterBaseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  openRouterModel: process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free",
  openRouterSiteUrl: process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
  openRouterAppName: process.env.OPENROUTER_APP_NAME || "StockCerdas",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "stockcerdas_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },
};

module.exports = { env };
