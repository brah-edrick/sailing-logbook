// app/api/boats/route.ts
import { prisma } from "@/lib/prisma";
import { boatApiSchema } from "@/validation/schemas";
import { NextResponse } from "next/server";
import {
  maybeValidationError,
  defaultServerError,
  errorHandlerStack,
} from "@/app/error-handlers";

export async function GET() {
  try {
    const boats = await prisma.boat.findMany();
    return NextResponse.json(boats);
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
