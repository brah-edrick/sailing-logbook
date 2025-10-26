import { PaginationMeta, PaginatedResponse } from "@/types/api";

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(
  searchParams: URLSearchParams
): PaginationQuery {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
  );
  const skip = (page - 1) * limit;
  const sortBy = searchParams.get("sortBy") || "id";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  meta: PaginationMeta
): PaginatedResponse<T> {
  return {
    data,
    meta,
  };
}

/**
 * Get Prisma orderBy object from pagination params
 */
export function getPrismaOrderBy(sortBy: string, sortOrder: "asc" | "desc") {
  // Map common sort fields to Prisma field names
  const fieldMap: Record<string, string> = {
    id: "id",
    name: "name",
    startTime: "startTime",
    endTime: "endTime",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  };

  const field = fieldMap[sortBy] || "id";

  return {
    [field]: sortOrder,
  };
}
