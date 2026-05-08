import { openai } from "@/lib/openai";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function POST(request) {
  const { error } = await getSessionOrThrow();
  if (error) return error;

  const body = await request.json();
  const { barcode } = body;

  if (!barcode) {
    return errorResponse("Barcode is required", "VALIDATION", 400);
  }

  try {
    const offResponse = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );

    if (offResponse.ok) {
      const data = await offResponse.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const nutriments = p.nutriments || {};

        return successResponse({
          source: "BARCODE",
          item: {
            name: p.product_name || "Unknown Product",
            portionG: parseFloat(p.serving_quantity) || 100,
            kcal: Math.round(nutriments["energy-kcal_100g"] || 0),
            proteinG: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
            carbG: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
            fatG: Math.round((nutriments.fat_100g || 0) * 10) / 10,
            confidence: 90,
          },
        });
      }
    }

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a nutrition database. Given a barcode number, try to identify the product and estimate its nutrition per 100g. Return JSON format:
{ "name": "...", "portionG": 100, "kcal": ..., "proteinG": ..., "carbG": ..., "fatG": ..., "confidence": 0-100 }
Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `Barcode: ${barcode}. What product is this and what is its nutrition per 100g?`,
        },
      ],
      max_tokens: 300,
    });

    const content = gptResponse.choices[0]?.message?.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const item = JSON.parse(cleaned);

    return successResponse({ source: "GPT_FALLBACK", item });
  } catch (e) {
    console.error("Barcode lookup error:", e);
    return errorResponse("Barcode lookup failed", "AI_ERROR", 500);
  }
}
