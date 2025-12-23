// app/api/activities/heatmap/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { errorHandlerStack } from "@/app/error-handlers";
import { ApiSailingActivityWithBoat } from "@/types/api";

export async function GET() {
  try {
    // Get activities from the last 52 weeks
    const fiftyTwoWeeksAgo = new Date();
    fiftyTwoWeeksAgo.setDate(fiftyTwoWeeksAgo.getDate() - 52 * 7);

    const activities = await prisma.sailingActivity.findMany({
      where: {
        startTime: {
          gte: fiftyTwoWeeksAgo,
        },
      },
      include: {
        boat: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Convert dates to ISO strings for JSON response
    const activitiesWithBoat: ApiSailingActivityWithBoat[] = activities.map(
      (activity) => ({
        ...activity,
        startTime: activity.startTime.toISOString(),
        endTime: activity.endTime.toISOString(),
      })
    );

    return NextResponse.json({ data: activitiesWithBoat });
  } catch (error) {
    return errorHandlerStack()(error);
  }
}
