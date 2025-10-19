// app/api/activities/route.ts
import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/validation/activities";
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
  const data = await req.json();
  const validatedData = activitySchema.parse(data);
  const activity = await prisma.sailingActivity.create({
    data: validatedData,
  });
  return NextResponse.json(activity, { status: 201 });
}
