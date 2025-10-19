// app/api/boats/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const boat = await prisma.boat.findUnique({
    where: { id: Number(id) },
  });
  return NextResponse.json(boat);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const data = await req.json();
  const { id } = await params;
  const boat = await prisma.boat.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(boat);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.boat.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
