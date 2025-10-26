import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { errorHandlerStack } from "@/app/error-handlers";
import {
  parsePaginationParams,
  createPaginationMeta,
  createPaginatedResponse,
  getPrismaOrderBy,
} from "@/utils/pagination";
import { PaginatedBoatActivitiesResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const pagination = parsePaginationParams(searchParams);

    // Get total count for pagination metadata (filtered by boatId)
    const total = await prisma.sailingActivity.count({
      where: {
        boatId: Number(id),
      },
    });

    // Get paginated activities for this boat
    const activities = await prisma.sailingActivity.findMany({
      where: {
        boatId: Number(id),
      },
      include: {
        boat: true,
      },
      orderBy: getPrismaOrderBy(pagination.sortBy, pagination.sortOrder),
      skip: pagination.skip,
      take: pagination.limit,
    });

    // Convert dates to ISO strings for JSON response
    const activitiesWithBoat = activities.map((activity) => ({
      ...activity,
      startTime: activity.startTime.toISOString(),
      endTime: activity.endTime.toISOString(),
    }));

    const meta = createPaginationMeta(pagination.page, pagination.limit, total);
    const response: PaginatedBoatActivitiesResponse = createPaginatedResponse(
      activitiesWithBoat,
      meta
    );

    return NextResponse.json(response);
  } catch (error) {
    return errorHandlerStack()(error);
  }
}
