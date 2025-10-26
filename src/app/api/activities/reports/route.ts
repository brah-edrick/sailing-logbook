import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateTotalMetrics,
  groupByBoatType,
  groupByActivityType,
  groupByBoatLength,
  ActivityWithBoat,
} from "@/utils/reports";
import { ApiActivitiesReport } from "@/types/api";
import { errorHandlerStack } from "@/app/error-handlers";

export async function GET() {
  try {
    // Get all activities with boat information
    const activities = await prisma.sailingActivity.findMany({
      include: {
        boat: true,
      },
    });

    // Convert to the format expected by our utilities
    const activitiesWithBoat: ActivityWithBoat[] = activities.map(
      (activity) => ({
        id: activity.id,
        boatId: activity.boatId,
        startTime: activity.startTime.toISOString(),
        endTime: activity.endTime.toISOString(),
        distanceNm: activity.distanceNm,
        purpose: activity.purpose,
        boat: activity.boat,
      })
    );

    // Calculate total metrics
    const total = calculateTotalMetrics(activitiesWithBoat);

    // Group by different dimensions
    const byBoatType = groupByBoatType(activitiesWithBoat);
    const byActivityType = groupByActivityType(activitiesWithBoat);
    const byBoatLength = groupByBoatLength(activitiesWithBoat);

    const report: ApiActivitiesReport = {
      total,
      byBoatType,
      byActivityType,
      byBoatLength,
    };

    return NextResponse.json(report);
  } catch (error) {
    return errorHandlerStack()(error);
  }
}
