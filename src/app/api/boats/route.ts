// app/api/boats/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const boats = await prisma.boat.findMany();
  return NextResponse.json(boats);
}

export async function POST(req: Request) {
  const data = await req.json();
  const boat = await prisma.boat.create({ data });
  return NextResponse.json(boat, { status: 201 });
}
