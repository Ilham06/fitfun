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
          content: `You are a body measurement reader. Analyze the photo (tape measure, scale, or written notes) and extract all visible measurements.

Return format:
{ "weightKg": ..., "waistCm": ..., "chestCm": ..., "hipsCm": ..., "armsCm": ..., "thighsCm": ..., "neckCm": ..., "bodyFatPct": ... }

Return null for any field not visible in the photo. Return ONLY valid JSON, no markdown.`,
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
            { type: "text", text: "Extract body measurements from this photo." },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const measurements = JSON.parse(cleaned);

    return successResponse({ measurements });
  } catch (e) {
    console.error("Body scan error:", e);
    return errorResponse("AI analysis failed. Please try again.", "AI_ERROR", 500);
  }
}
