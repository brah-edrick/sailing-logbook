// app/api/boats/route.ts
import { prisma } from "@/lib/prisma";
import { boatApiSchema } from "@/validation/schemas";
import { NextRequest, NextResponse } from "next/server";
import { maybeValidationError, errorHandlerStack } from "@/app/error-handlers";
import {
  parsePaginationParams,
  createPaginationMeta,
  createPaginatedResponse,
  getPrismaOrderBy,
} from "@/utils/pagination";
import { PaginatedBoatsResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    // Check if "all" limit is requested
    if (limitParam === "all") {
      const boats = await prisma.boat.findMany({
        orderBy: { name: "asc" }, // Default ordering for all boats
      });

      const meta = createPaginationMeta(1, boats.length, boats.length);
      const response: PaginatedBoatsResponse = createPaginatedResponse(
        boats,
        meta
      );

      return NextResponse.json(response);
    }

    // Normal pagination
    const pagination = parsePaginationParams(searchParams);

    // Get total count for pagination metadata
    const total = await prisma.boat.count();

    // Get paginated boats
    const boats = await prisma.boat.findMany({
      orderBy: getPrismaOrderBy(pagination.sortBy, pagination.sortOrder),
      skip: pagination.skip,
      take: pagination.limit,
    });

    const meta = createPaginationMeta(pagination.page, pagination.limit, total);
    const response: PaginatedBoatsResponse = createPaginatedResponse(
      boats,
      meta
    );

    return NextResponse.json(response);
  } catch (error) {
    return errorHandlerStack()(error);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = boatApiSchema.parse(data);
    const boat = await prisma.boat.create({ data: validatedData });
    return NextResponse.json(boat, { status: 201 });
  } catch (error) {
    return errorHandlerStack(maybeValidationError)(error);
  }
}
