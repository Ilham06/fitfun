import { searchFood } from "@/lib/food-database";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function GET(request) {
  const { error } = await getSessionOrThrow();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) {
    return successResponse({ results: [] });
  }

  const results = searchFood(q);

  return successResponse({ results: results.slice(0, 20) });
}
