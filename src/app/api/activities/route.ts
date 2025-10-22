// app/api/activities/route.ts
import { prisma } from "@/lib/prisma";
import { activityApiSchema } from "@/validation/schemas";
import { NextResponse } from "next/server";

export async function GET() {
  const activities = await prisma.sailingActivity.findMany({
    include: {
      boat: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });
  return NextResponse.json(activities);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = activityApiSchema.parse(data);
    const activity = await prisma.sailingActivity.create({
      data: validatedData,
    });
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Invalid activity data" },
      { status: 400 }
    );
  }
}
