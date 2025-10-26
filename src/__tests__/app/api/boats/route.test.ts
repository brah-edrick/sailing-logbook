/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/boats/route";
import { prisma } from "@/lib/prisma";
import { BoatApiInput } from "@/validation/schemas";
import type { Boat } from "@prisma/client";
import { suppressConsoleError } from "@test-utils/console";
import { NextRequest } from "next/server";

const mockPrisma = jest.mocked(prisma);

describe("GET /api/boats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of boats", async () => {
    const mockBoats = [
      {
        id: 1,
        name: "Test Boat 1",
        type: "monohull",
        make: "Test Make",
        model: "Test Model",
        year: 2020,
        lengthFt: 30,
        beamFt: 10,
        sailNumber: "12345",
        homePort: "Test Port",
        owner: "Test Owner",
        notes: "Test notes",
        colorHex: "#FF0000",
      },
      {
        id: 2,
        name: "Test Boat 2",
        type: "catamaran",
        make: "Test Make 2",
        model: "Test Model 2",
        year: 2021,
        lengthFt: 40,
        beamFt: 15,
        sailNumber: "67890",
        homePort: "Test Port 2",
        owner: "Test Owner 2",
        notes: "Test notes 2",
        colorHex: "#00FF00",
      },
    ] as Boat[];

    mockPrisma.boat.findMany.mockResolvedValue(mockBoats);
    mockPrisma.boat.count.mockResolvedValue(2);

    // Create a mock request with URL
    const mockRequest = {
      url: "http://localhost:3000/api/boats?page=1&limit=10",
    } as NextRequest;

    const response = await GET(mockRequest);
    expect(response?.status).toBe(200);
    expect(mockPrisma.boat.findMany).toHaveBeenCalledWith({
      orderBy: {
        id: "desc",
      },
      skip: 0,
      take: 10,
    });

    const data = await response?.json();
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("meta");
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data).toHaveLength(2);
    expect(data.meta).toMatchObject({
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  });

  it("should handle database errors when fetching boats", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.boat.findMany.mockRejectedValue(new Error("Database error"));

    // Create a mock request with URL
    const mockRequest = {
      url: "http://localhost:3000/api/boats?page=1&limit=10",
    } as NextRequest;

    const response = await GET(mockRequest);
    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});

describe("POST /api/boats", () => {
  it("should create a new boat", async () => {
    const mockBoat = {
      id: 1,
      name: "Test Boat",
      type: "monohull",
      make: "Test Make",
      lengthFt: 30,
    } as Boat;

    mockPrisma.boat.create.mockResolvedValue(mockBoat);

    const payload: BoatApiInput = {
      name: "Test Boat",
      type: "monohull",
      make: "Test Make",
      model: null,
      sailNumber: null,
      homePort: null,
      owner: null,
      notes: null,
      colorHex: null,
      year: 2020,
      lengthFt: 30,
      beamFt: null,
    };

    const mockRequest = {
      json: () => Promise.resolve(payload),
    } as NextRequest;

    const response = await POST(mockRequest);
    expect(response?.status).toBe(201);

    const data = await response?.json();
    expect(data).toEqual(mockBoat);
  });

  it("should return a 400 status code if the payload is invalid", async () => {
    const restoreConsole = suppressConsoleError();

    const payload = {
      name: "Test Boat",
      // Missing required fields
    };
    const mockRequest = {
      json: () => Promise.resolve(payload),
    } as NextRequest;

    const response = await POST(mockRequest);
    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Invalid data provided" });

    restoreConsole();
  });

  it("should handle database errors when creating boat", async () => {
    const restoreConsole = suppressConsoleError();

    const payload: BoatApiInput = {
      name: "Test Boat",
      type: "monohull",
      make: "Test Make",
      model: null,
      sailNumber: null,
      homePort: null,
      owner: null,
      notes: null,
      colorHex: null,
      year: 2020,
      lengthFt: 30,
      beamFt: null,
    };

    mockPrisma.boat.create.mockRejectedValue(new Error("Database error"));

    const mockRequest = {
      json: () => Promise.resolve(payload),
    } as NextRequest;

    const response = await POST(mockRequest);
    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});
