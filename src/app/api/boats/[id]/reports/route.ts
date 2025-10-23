import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateTotalMetrics,
  groupByActivityType,
  groupActivitiesByField,
  ActivityWithBoat,
} from "@/utils/reports";
import { ApiBoatReport } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const boatId = parseInt(params.id);

    if (isNaN(boatId)) {
      return NextResponse.json({ error: "Invalid boat ID" }, { status: 400 });
    }

    // Get the boat information
    const boat = await prisma.boat.findUnique({
      where: { id: boatId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!boat) {
      return NextResponse.json({ error: "Boat not found" }, { status: 404 });
    }

    // Get all activities for this specific boat
    const activities = await prisma.sailingActivity.findMany({
      where: { boatId },
      include: {
        boat: {
          select: {
            id: true,
            type: true,
            lengthFt: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    // Convert to the format expected by our utilities
    const activitiesWithBoat: ActivityWithBoat[] = activities.map(
      (activity) => ({
        id: activity.id,
        boatId: activity.boatId,
        startTime: activity.startTime,
        endTime: activity.endTime,
        distanceNm: activity.distanceNm,
        purpose: activity.purpose,
        boat: activity.boat,
      })
    );

    // Calculate total metrics
    const total = calculateTotalMetrics(activitiesWithBoat);

    // Group by activity type
    const byActivityType = groupByActivityType(activitiesWithBoat);

    // Group by month (YYYY-MM format)
    const byMonth = groupActivitiesByField(activitiesWithBoat, (activity) => {
      const date = new Date(activity.startTime);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });

    // Group by year
    const byYear = groupActivitiesByField(activitiesWithBoat, (activity) => {
      const date = new Date(activity.startTime);
      return date.getFullYear().toString();
    });

    const report: ApiBoatReport = {
      boatId: boat.id,
      boatName: boat.name,
      total,
      byActivityType,
      byMonth,
      byYear,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating boat report:", error);
    return NextResponse.json(
      { error: "Failed to generate boat report" },
      { status: 500 }
    );
  }
}
