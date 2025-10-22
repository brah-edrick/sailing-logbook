// app/api/activities/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { activityApiSchema } from "@/validation/schemas";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const activity = await prisma.sailingActivity.findUnique({
    where: { id: Number(id) },
  });

  if (!activity) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(activity);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const data = await req.json();
  const { id } = await params;

  const validatedData = activityApiSchema.parse(data);

  const updated = await prisma.sailingActivity.update({
    where: { id: Number(id) },
    data: validatedData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.sailingActivity.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
