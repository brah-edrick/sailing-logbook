import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function errorHandlerStack(
  ...handlers: ((error: unknown) => NextResponse | undefined)[]
): (error: unknown) => NextResponse | undefined {
  return (error: unknown) => {
    for (const handler of handlers) {
      const result = handler(error);
      if (result) {
        return result;
      }
    }

    return defaultServerError(error);
  };
}

/**
 * Handles validation errors (ZodError) - returns 400 status
 */
export function maybeValidationError(
  error: unknown,
  message: string = "Invalid data provided"
): NextResponse | undefined {
  if (error instanceof ZodError) {
    console.error("Validation Error:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * Handles Prisma "Record to delete does not exist" error - returns 404 status
 */
export function maybeNotFoundOnDelete(
  error: unknown,
  message: string = "Not found"
): NextResponse | undefined {
  if (
    error instanceof Error &&
    error.message.includes("Record to delete does not exist")
  ) {
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

/**
 * Returns a 404 response for when a record is not found
 * This is used when the database call succeeds but returns null/undefined
 */
export function notFoundResponse(message: string = "Not found"): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Handles server errors - returns 500 status
 * Used for database errors, network issues, etc.
 */
export function defaultServerError(error: unknown): NextResponse {
  console.error("Server Error:", error);

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
