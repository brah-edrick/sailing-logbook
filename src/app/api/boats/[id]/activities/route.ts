import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { defaultServerError, errorHandlerStack } from "@/app/error-handlers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const activities = await prisma.sailingActivity.findMany({
      where: {
        boatId: Number(id),
      },
      include: {
        boat: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    return errorHandlerStack()(error);
  }
}
