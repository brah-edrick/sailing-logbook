// app/api/boats/route.ts
import { prisma } from "@/lib/prisma";
import { boatApiSchema } from "@/validation/schemas";
import { NextResponse } from "next/server";

export async function GET() {
  const boats = await prisma.boat.findMany();
  return NextResponse.json(boats);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = boatApiSchema.parse(data);
    const boat = await prisma.boat.create({ data: validatedData });
    return NextResponse.json(boat, { status: 201 });
  } catch (error) {
    console.error("Error creating boat:", error);
    return NextResponse.json({ error: "Invalid boat data" }, { status: 400 });
  }
}
