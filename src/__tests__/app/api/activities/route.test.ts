/**
 * @jest-environment node
 */

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    sailingActivity: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { GET, POST } from "@/app/api/activities/route";
import { prisma } from "@/lib/prisma";
import { ActivityApiInput } from "@/validation/schemas";
import type { SailingActivity } from "@prisma/client";
import { suppressConsoleError } from "@test-utils/console";

const mockPrisma = jest.mocked(prisma);

describe("GET /api/activities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of activities", async () => {
    const mockActivities = [
      {
        id: 1,
        boatId: 1,
      },
      {
        id: 2,
        boatId: 2,
      },
    ] as SailingActivity[]; // not a complete type, but it's ok for testing

    mockPrisma.sailingActivity.findMany.mockResolvedValue(mockActivities);

    const response = await GET();
    expect(response?.status).toBe(200);
    expect(mockPrisma.sailingActivity.findMany).toHaveBeenCalledWith({
      include: {
        boat: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    const data = await response?.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toEqual(mockActivities);
  });

  it("should handle database errors when fetching activities", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.sailingActivity.findMany.mockRejectedValue(
      new Error("Database error")
    );

    const response = await GET();
    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});

describe("POST /api/activities", () => {
  it("should create a new activity", async () => {
    const mockActivity = {
      id: 1,
      boatId: 1,
      startTime: new Date("2024-01-01T10:00:00Z"),
      endTime: new Date("2024-01-01T12:00:00Z"),
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
      notes: "Great day on the water",
    } as SailingActivity;

    mockPrisma.sailingActivity.create.mockResolvedValue(mockActivity);

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

    const mockRequest = {
      json: () => Promise.resolve(payload),
    } as Request;

    const response = await POST(mockRequest);
    expect(response?.status).toBe(201);

    const data = await response?.json();
    expect(data).toEqual(JSON.parse(JSON.stringify(mockActivity))); // convert to JSON to avoid date comparison issues
  });

  it("should return a 400 status code if the payload is invalid", async () => {
    const restoreConsole = suppressConsoleError();

    const payload = {
      boatId: 1,
      startTime: "2024-01-01T10:00:00Z",
      endTime: "2024-01-01T12:00:00Z",
      departureLocation: "Marina",
      returnLocation: "Marina",
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

  it("should handle database errors when creating activity", async () => {
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

    mockPrisma.sailingActivity.create.mockRejectedValue(
      new Error("Database error")
    );

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
