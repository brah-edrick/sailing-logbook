/**
 * @jest-environment node
 */

import { GET, PUT, DELETE } from "@/app/api/boats/[id]/route";
import { prisma } from "@/lib/prisma";
import type { Boat } from "@prisma/client";
import { BoatApiInput } from "@/validation/schemas";
import { suppressConsoleError } from "@test-utils/console";

const mockPrisma = jest.mocked(prisma);

describe("GET /api/boats/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a boat when found", async () => {
    const mockBoat = {
      id: 1,
      name: "Test Boat",
      type: "monohull",
      lengthFt: 30,
    } as Boat;

    mockPrisma.boat.findUnique.mockResolvedValue(mockBoat);

    const mockParams = Promise.resolve({ id: "1" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual(mockBoat);
    expect(mockPrisma.boat.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return 404 when boat not found", async () => {
    mockPrisma.boat.findUnique.mockResolvedValue(null);

    const mockParams = Promise.resolve({ id: "999" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(404);
    const data = await response?.json();
    expect(data).toEqual({ error: "Boat not found" });
  });

  it("should return 400 for empty boat ID", async () => {
    const mockParams = Promise.resolve({ id: "" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Boat ID is required" });
  });

  it("should return 400 for invalid boat ID", async () => {
    const mockParams = Promise.resolve({ id: "invalid" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Invalid boat ID" });
  });

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.boat.findUnique.mockRejectedValue(new Error("Database error"));

    const mockParams = Promise.resolve({ id: "1" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});

describe("PUT /api/boats/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a boat with valid data", async () => {
    const mockBoat = {
      id: 1,
      name: "Updated Boat",
      type: "monohull",
      lengthFt: 35,
    } as Boat;

    const payload: BoatApiInput = {
      name: "Updated Boat",
      type: "monohull",
      lengthFt: 35,
      beamFt: 10,
      year: 2020,
      model: "Test Model",
      make: "Test Make",
      sailNumber: "12345",
      homePort: "Test Port",
      owner: "Test Owner",
      notes: "Test notes",
      colorHex: "#000000",
    };

    mockPrisma.boat.update.mockResolvedValue(mockBoat);

    const mockRequest = {
      json: () => Promise.resolve(payload),
    } as Request;

    const mockParams = Promise.resolve({ id: "1" });
    const response = await PUT(mockRequest, { params: mockParams });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual(mockBoat);
    expect(mockPrisma.boat.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: payload,
    });
  });

  it("should return 400 for invalid data", async () => {
    const restoreConsole = suppressConsoleError();

    const invalidPayload = {
      name: "Test Boat",
      // Missing required fields
    };

    const mockRequest = {
      json: () => Promise.resolve(invalidPayload),
    } as Request;

    const mockParams = Promise.resolve({ id: "1" });
    const response = await PUT(mockRequest, { params: mockParams });

    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Invalid data provided" });

    restoreConsole();
  });

  it("should return 400 for empty boat ID", async () => {
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

    const mockParams = Promise.resolve({ id: "" });
    const response = await PUT(mockRequest, { params: mockParams });

    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Boat ID is required" });
  });

  it("should return 400 for invalid boat ID", async () => {
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

    const mockParams = Promise.resolve({ id: "invalid" });
    const response = await PUT(mockRequest, { params: mockParams });

    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Invalid boat ID" });
  });

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    const payload: BoatApiInput = {
      name: "Test Boat",
      type: "monohull",
      lengthFt: 30,
      beamFt: 10,
      make: "Test Make",
      model: "Test Model",
      sailNumber: "12345",
      homePort: "Test Port",
      owner: "Test Owner",
      notes: "Test notes",
      colorHex: "#000000",
    };

    mockPrisma.boat.update.mockRejectedValue(new Error("Database error"));

    const mockRequest = {
      json: () => Promise.resolve(payload),
    } as Request;

    const mockParams = Promise.resolve({ id: "1" });
    const response = await PUT(mockRequest, { params: mockParams });

    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});

describe("DELETE /api/boats/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a boat", async () => {
    mockPrisma.boat.delete.mockResolvedValue({} as Boat);

    const mockParams = Promise.resolve({ id: "1" });
    const response = await DELETE({} as Request, { params: mockParams });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual({ success: true });
    expect(mockPrisma.boat.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return 400 for empty boat ID", async () => {
    const mockParams = Promise.resolve({ id: "" });
    const response = await DELETE({} as Request, { params: mockParams });

    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Boat ID is required" });
  });

  it("should return 400 for invalid boat ID", async () => {
    const mockParams = Promise.resolve({ id: "invalid" });
    const response = await DELETE({} as Request, { params: mockParams });

    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Invalid boat ID" });
  });

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.boat.delete.mockRejectedValue(new Error("Database error"));

    const mockParams = Promise.resolve({ id: "1" });
    const response = await DELETE({} as Request, { params: mockParams });

    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});
