import { openai } from "@/lib/openai";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function POST(request) {
  const { error } = await getSessionOrThrow();
  if (error) return error;

  const body = await request.json();
  const { image } = body;

  if (!image) {
    return errorResponse("Base64 image is required", "VALIDATION", 400);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a nutrition analyst. Analyze the food photo and return a JSON array of detected food items with estimated nutrition per item.

Return format:
[
  { "name": "...", "portionG": ..., "kcal": ..., "proteinG": ..., "carbG": ..., "fatG": ..., "confidence": 0-100 }
]

Be specific about portion sizes. If multiple items are visible, list each separately. Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`,
              },
            },
            { type: "text", text: "Analyze this food photo and return nutrition data as JSON." },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || "[]";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const items = JSON.parse(cleaned);

    return successResponse({ items });
  } catch (e) {
    console.error("Food scan error:", e);
    return errorResponse("AI analysis failed. Please try again.", "AI_ERROR", 500);
  }
}
