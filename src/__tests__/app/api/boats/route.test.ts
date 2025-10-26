/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/boats/route";
import { prisma } from "@/lib/prisma";
import { BoatApiInput } from "@/validation/schemas";
import type { Boat } from "@prisma/client";
import { suppressConsoleError } from "@test-utils/console";

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
        lengthFt: 30,
      },
      {
        id: 2,
        name: "Test Boat 2",
        type: "catamaran",
        make: "Test Make",
        lengthFt: 40,
      },
    ] as Boat[];

    mockPrisma.boat.findMany.mockResolvedValue(mockBoats);

    const response = await GET();
    expect(response?.status).toBe(200);
    expect(mockPrisma.boat.findMany).toHaveBeenCalledWith();

    const data = await response?.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toEqual(mockBoats);
  });

  it("should handle database errors when fetching boats", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.boat.findMany.mockRejectedValue(new Error("Database error"));

    const response = await GET();
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
    } as Request;

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
    } as Request;

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
    } as Request;

    const response = await POST(mockRequest);
    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});
