// app/api/activities/route.ts
import { prisma } from "@/lib/prisma";
import { activityApiSchema } from "@/validation/schemas";
import { NextRequest, NextResponse } from "next/server";
import { maybeValidationError, errorHandlerStack } from "@/app/error-handlers";
import {
  parsePaginationParams,
  createPaginationMeta,
  createPaginatedResponse,
  getPrismaOrderBy,
} from "@/utils/pagination";
import { PaginatedActivitiesResponse } from "@/types/api";
import { requireAuth } from "@/lib/authUtils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = parsePaginationParams(searchParams);

    // Get total count for pagination metadata
    const total = await prisma.sailingActivity.count();

    // Get paginated activities
    const activities = await prisma.sailingActivity.findMany({
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
    const response: PaginatedActivitiesResponse = createPaginatedResponse(
      activitiesWithBoat,
      meta
    );

    return NextResponse.json(response);
  } catch (error) {
    return errorHandlerStack()(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(); // Require authentication for creating activities

    const data = await req.json();
    const validatedData = activityApiSchema.parse(data);
    const activity = await prisma.sailingActivity.create({
      data: validatedData,
    });
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return errorHandlerStack(maybeValidationError)(error);
  }
}
