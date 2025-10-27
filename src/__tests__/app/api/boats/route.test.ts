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

// Mock authentication
jest.mock("@/lib/authUtils", () => ({
  requireAuth: jest.fn().mockResolvedValue({
    user: { id: "test-user", name: "Test User", email: "test@example.com" },
  }),
}));

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

  it("should return all boats when limit=all is specified", async () => {
    const mockBoats = [
      {
        id: 1,
        name: "Alpha Boat",
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
        name: "Beta Boat",
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
      {
        id: 3,
        name: "Charlie Boat",
        type: "monohull",
        make: "Test Make 3",
        model: "Test Model 3",
        year: 2022,
        lengthFt: 35,
        beamFt: 12,
        sailNumber: "11111",
        homePort: "Test Port 3",
        owner: "Test Owner 3",
        notes: "Test notes 3",
        colorHex: "#0000FF",
      },
    ] as Boat[];

    mockPrisma.boat.findMany.mockResolvedValue(mockBoats);

    // Create a mock request with limit=all
    const mockRequest = {
      url: "http://localhost:3000/api/boats?limit=all",
    } as NextRequest;

    const response = await GET(mockRequest);
    expect(response?.status).toBe(200);

    // Verify that findMany was called with the correct parameters for "all" limit
    expect(mockPrisma.boat.findMany).toHaveBeenCalledWith({
      orderBy: { name: "asc" },
    });

    const data = await response?.json();
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("meta");
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data).toHaveLength(3);

    // Verify pagination metadata reflects "all" limit
    expect(data.meta).toMatchObject({
      page: 1,
      limit: 3, // Should equal the total number of boats
      total: 3,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });

    // Verify boats are ordered by name
    expect(data.data[0].name).toBe("Alpha Boat");
    expect(data.data[1].name).toBe("Beta Boat");
    expect(data.data[2].name).toBe("Charlie Boat");
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
