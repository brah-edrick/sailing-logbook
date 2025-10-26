// app/api/activities/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { activityApiSchema } from "@/validation/schemas";
import { NextResponse } from "next/server";
import {
  maybeValidationError,
  maybeNotFoundOnDelete,
  errorHandlerStack,
  notFoundResponse,
} from "@/app/error-handlers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activity = await prisma.sailingActivity.findUnique({
      where: { id: Number(id) },
    });

    if (!activity) {
      return notFoundResponse();
    }

    return NextResponse.json(activity);
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

    const validatedData = activityApiSchema.parse(data);

    const updated = await prisma.sailingActivity.update({
      where: { id: Number(id) },
      data: validatedData,
    });

    return NextResponse.json(updated);
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
    await prisma.sailingActivity.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorHandlerStack(maybeNotFoundOnDelete)(error);
  }
}
