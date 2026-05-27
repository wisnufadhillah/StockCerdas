const { env } = require("../config/env");

async function generateRestockRecommendation({
  productName,
  currentStock,
  predictedDemand,
  recommendedRestock,
  riskLevel,
  forecastPeriod,
}) {
  if (!env.openRouterApiKey) {
    return null;
  }

  const prompt = [
    "Kamu adalah asisten inventory untuk UMKM.",
    "Buat rekomendasi singkat dalam Bahasa Indonesia berdasarkan prediksi stok berikut.",
    `Produk: ${productName}`,
    `Stok saat ini: ${currentStock}`,
    `Prediksi kebutuhan: ${predictedDemand}`,
    `Rekomendasi restock: ${recommendedRestock}`,
    `Level risiko: ${riskLevel}`,
    `Periode prediksi: ${forecastPeriod}`,
    "Jawab maksimal 3 bullet pendek: tindakan restock, alasan, dan catatan risiko.",
  ].join("\n");

  const response = await fetch(`${env.openRouterBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "HTTP-Referer": env.openRouterSiteUrl,
      "X-OpenRouter-Title": env.openRouterAppName,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openRouterModel,
      messages: [
        { role: "system", content: "Kamu adalah asisten inventory yang menjawab singkat dan praktis." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

module.exports = { generateRestockRecommendation };
