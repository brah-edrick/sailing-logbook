// app/api/boats/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { boatApiSchema } from "@/validation/schemas";
import { NextResponse } from "next/server";
import {
  maybeValidationError,
  errorHandlerStack,
  notFoundResponse,
} from "@/app/error-handlers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        { error: "Boat ID is required" },
        { status: 400 }
      );
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid boat ID" }, { status: 400 });
    }

    const boat = await prisma.boat.findUnique({
      where: { id: numericId },
    });

    if (!boat) {
      return notFoundResponse("Boat not found");
    }

    return NextResponse.json(boat);
  } catch (error) {
    return errorHandlerStack()(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Boat ID is required" },
        { status: 400 }
      );
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid boat ID" }, { status: 400 });
    }

    const validatedData = boatApiSchema.parse(data);

    const boat = await prisma.boat.update({
      where: { id: numericId },
      data: validatedData,
    });
    return NextResponse.json(boat);
  } catch (error) {
    return errorHandlerStack(maybeValidationError)(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Boat ID is required" },
        { status: 400 }
      );
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid boat ID" }, { status: 400 });
    }

    await prisma.boat.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorHandlerStack()(error);
  }
}
