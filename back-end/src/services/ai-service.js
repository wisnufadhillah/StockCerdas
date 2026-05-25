const { env } = require("../config/env");

async function requestAiPrediction(features) {
  if (!Array.isArray(features) || features.length === 0) {
    return null;
  }

  const response = await fetch(`${env.aiServiceUrl}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI service error ${response.status}: ${text}`);
  }

  return response.json();
}

module.exports = { requestAiPrediction };
