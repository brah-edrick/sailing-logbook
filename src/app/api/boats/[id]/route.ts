// app/api/boats/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { boatApiSchema } from "@/validation/schemas";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add timeout to prevent hanging on params resolution
    const paramsResult = (await Promise.race([
      params,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Params timeout")), 5000)
      ),
    ])) as { id: string };

    const { id } = paramsResult;

    if (!id || id.trim() === "") {
      console.warn("Empty or missing boat ID in request");
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
      return NextResponse.json({ error: "Boat not found" }, { status: 404 });
    }

    return NextResponse.json(boat);
  } catch (error) {
    console.error("Error fetching boat:", error);

    // Handle specific timeout error
    if (error instanceof Error && error.message === "Params timeout") {
      console.error(
        "Route params resolution timeout - possible race condition"
      );
      return NextResponse.json(
        { error: "Request timeout - please try again" },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();

    // Add timeout to prevent hanging on params resolution
    const paramsResult = (await Promise.race([
      params,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Params timeout")), 5000)
      ),
    ])) as { id: string };

    const { id } = paramsResult;

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
    console.error("Error updating boat:", error);

    // Handle specific timeout error
    if (error instanceof Error && error.message === "Params timeout") {
      console.error(
        "Route params resolution timeout - possible race condition"
      );
      return NextResponse.json(
        { error: "Request timeout - please try again" },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add timeout to prevent hanging on params resolution
    const paramsResult = (await Promise.race([
      params,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Params timeout")), 5000)
      ),
    ])) as { id: string };

    const { id } = paramsResult;

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
    console.error("Error deleting boat:", error);

    // Handle specific timeout error
    if (error instanceof Error && error.message === "Params timeout") {
      console.error(
        "Route params resolution timeout - possible race condition"
      );
      return NextResponse.json(
        { error: "Request timeout - please try again" },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
