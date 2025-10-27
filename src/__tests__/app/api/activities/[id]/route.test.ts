/**
 * @jest-environment node
 */

import { GET, PUT, DELETE } from "@/app/api/activities/[id]/route";
import { prisma } from "@/lib/prisma";
import type { SailingActivity } from "@prisma/client";
import { ActivityApiInput } from "@/validation/schemas";
import { suppressConsoleError } from "@test-utils/console";

const mockPrisma = jest.mocked(prisma);

// Mock authentication
jest.mock("@/lib/authUtils", () => ({
  requireAuth: jest.fn().mockResolvedValue({
    user: { id: "test-user", name: "Test User", email: "test@example.com" },
  }),
}));

describe("GET /api/activities/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an activity when found", async () => {
    const mockActivity = {
      id: 1,
      boatId: 1,
      startTime: new Date("2024-01-01T10:00:00Z"),
      endTime: new Date("2024-01-01T12:00:00Z"),
      notes: null,
      departureLocation: "Marina",
      returnLocation: "Marina",
      distanceNm: 5,
      avgSpeedKnots: 6,
      windSpeedKnots: 10,
      windDirection: "n",
      weatherConditions: "sunny",
      seaState: "calm",
      sailConfiguration: "Full main and jib",
      activityType: "sailing",
      purpose: "cruising",
    } as SailingActivity;

    mockPrisma.sailingActivity.findUnique.mockResolvedValue(mockActivity);

    const mockParams = Promise.resolve({ id: "1" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual(JSON.parse(JSON.stringify(mockActivity))); // convert to JSON to avoid date comparison issues
    expect(mockPrisma.sailingActivity.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return 404 when activity not found", async () => {
    mockPrisma.sailingActivity.findUnique.mockResolvedValue(null);

    const mockParams = Promise.resolve({ id: "999" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(404);
    const data = await response?.json();
    expect(data).toEqual({ error: "Not found" });
  });

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.sailingActivity.findUnique.mockRejectedValue(
      new Error("Database error")
    );

    const mockParams = Promise.resolve({ id: "1" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});

describe("PUT /api/activities/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update an activity with valid data", async () => {
    const mockActivity = {
      id: 1,
      boatId: 1,
      startTime: new Date("2024-01-01T10:00:00Z"),
      endTime: new Date("2024-01-01T12:00:00Z"),
      notes: "Great day on the water",
      departureLocation: "Marina",
      returnLocation: "Marina",
      distanceNm: 5,
      avgSpeedKnots: 6,
      windSpeedKnots: 10,
      weatherConditions: "sunny",
      windDirection: "n",
      seaState: "calm",
      sailConfiguration: "Full main and jib",
      purpose: "cruising",
    } as SailingActivity;

    const payload: ActivityApiInput = {
      boatId: 1,
      startTime: "2024-01-01T10:00:00Z",
      endTime: "2024-01-01T12:00:00Z",
      departureLocation: "Marina",
      returnLocation: "Marina",
      distanceNm: 5,
      avgSpeedKnots: 6,
      windSpeedKnots: 10,
      weatherConditions: "sunny",
      windDirection: "n",
      seaState: "calm",
      sailConfiguration: "Full main and jib",
      purpose: "cruising",
      notes: "Great day on the water",
    };

    mockPrisma.sailingActivity.update.mockResolvedValue(mockActivity);

    const mockRequest = {
      json: () => Promise.resolve(payload),
    } as Request;

    const mockParams = Promise.resolve({ id: "1" });
    const response = await PUT(mockRequest, { params: mockParams });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual(JSON.parse(JSON.stringify(mockActivity))); // convert to JSON to avoid date comparison issues
    expect(mockPrisma.sailingActivity.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: payload,
    });
  });

  it("should return 400 for invalid data", async () => {
    const restoreConsole = suppressConsoleError();

    const invalidPayload = {
      boatId: 1,
      startTime: "2024-01-01T10:00:00Z",
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

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    const payload: ActivityApiInput = {
      boatId: 1,
      startTime: "2024-01-01T10:00:00Z",
      endTime: "2024-01-01T12:00:00Z",
      departureLocation: "Marina",
      returnLocation: "Marina",
      distanceNm: 5,
      avgSpeedKnots: 6,
      windSpeedKnots: 10,
      weatherConditions: "sunny",
      windDirection: "n",
      seaState: "calm",
      sailConfiguration: "Full main and jib",
      purpose: "cruising",
      notes: "Great day on the water",
    };

    mockPrisma.sailingActivity.update.mockRejectedValue(
      new Error("Database error")
    );

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

describe("DELETE /api/activities/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete an activity", async () => {
    mockPrisma.sailingActivity.delete.mockResolvedValue({} as SailingActivity);

    const mockParams = Promise.resolve({ id: "1" });
    const response = await DELETE({} as Request, { params: mockParams });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual({ success: true });
    expect(mockPrisma.sailingActivity.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.sailingActivity.delete.mockRejectedValue(
      new Error("Database error")
    );

    const mockParams = Promise.resolve({ id: "1" });
    const response = await DELETE({} as Request, { params: mockParams });

    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});
