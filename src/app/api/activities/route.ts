// app/api/activities/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const activities = await prisma.sailingActivity.findMany({
    include: {
      boat: true,
    },
    orderBy: {
      startTime: 'desc',
    },
  });
  return NextResponse.json(activities);
}

export async function POST(req: Request) {
  const data = await req.json();
  const activity = await prisma.sailingActivity.create({
    data,
  });

  return NextResponse.json(activity, { status: 201 });
}
