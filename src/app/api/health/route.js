import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    const userCount = await prisma.user.count();
    return Response.json({
      status: "ok",
      db: "connected",
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({
      status: "error",
      db: "failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
