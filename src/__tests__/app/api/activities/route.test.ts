/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/activities/route";
import { prisma } from "@/lib/prisma";
import { ActivityApiInput } from "@/validation/schemas";
import type { SailingActivity, Boat } from "@prisma/client";
import { suppressConsoleError } from "@test-utils/console";
import { NextRequest } from "next/server";

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
        startTime: new Date("2024-01-01T10:00:00Z"),
        endTime: new Date("2024-01-01T12:00:00Z"),
        boat: {
          id: 1,
          name: "Test Boat",
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
      },
      {
        id: 2,
        boatId: 2,
        startTime: new Date("2024-01-02T10:00:00Z"),
        endTime: new Date("2024-01-02T12:00:00Z"),
        boat: {
          id: 2,
          name: "Test Boat 2",
          type: "catamaran",
          make: "Test Make 2",
          model: "Test Model 2",
          year: 2021,
          lengthFt: 35,
          beamFt: 15,
          sailNumber: "67890",
          homePort: "Test Port 2",
          owner: "Test Owner 2",
          notes: "Test notes 2",
          colorHex: "#00FF00",
        },
      },
    ] as (SailingActivity & { boat: Boat })[];

    mockPrisma.sailingActivity.findMany.mockResolvedValue(mockActivities);
    mockPrisma.sailingActivity.count.mockResolvedValue(2);

    // Create a mock request with URL
    const mockRequest = {
      url: "http://localhost:3000/api/activities?page=1&limit=10",
    } as NextRequest;

    const response = await GET(mockRequest);
    expect(response?.status).toBe(200);
    expect(mockPrisma.sailingActivity.findMany).toHaveBeenCalledWith({
      include: {
        boat: true,
      },
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

  it("should handle pagination parameters correctly", async () => {
    const mockActivities = [
      {
        id: 1,
        boatId: 1,
        startTime: new Date("2024-01-01T10:00:00Z"),
        endTime: new Date("2024-01-01T12:00:00Z"),
        boat: {
          id: 1,
          name: "Test Boat",
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
      },
    ] as (SailingActivity & { boat: Boat })[];

    mockPrisma.sailingActivity.findMany.mockResolvedValue(mockActivities);
    mockPrisma.sailingActivity.count.mockResolvedValue(25);

    // Test with custom pagination parameters
    const mockRequest = {
      url: "http://localhost:3000/api/activities?page=2&limit=5&sortBy=startTime&sortOrder=asc",
    } as NextRequest;

    const response = await GET(mockRequest);
    expect(response?.status).toBe(200);

    const data = await response?.json();
    expect(data.meta).toMatchObject({
      page: 2,
      limit: 5,
      total: 25,
      totalPages: 5,
      hasNextPage: true,
      hasPrevPage: true,
    });

    expect(mockPrisma.sailingActivity.findMany).toHaveBeenCalledWith({
      include: {
        boat: true,
      },
      orderBy: {
        startTime: "asc",
      },
      skip: 5, // (page 2 - 1) * limit 5
      take: 5,
    });
  });

  it("should handle invalid pagination parameters gracefully", async () => {
    const mockActivities = [] as (SailingActivity & { boat: Boat })[];
    mockPrisma.sailingActivity.findMany.mockResolvedValue(mockActivities);
    mockPrisma.sailingActivity.count.mockResolvedValue(0);

    // Test with invalid parameters (should fallback to defaults)
    const mockRequest = {
      url: "http://localhost:3000/api/activities?page=-1&limit=0&sortBy=invalidField",
    } as NextRequest;

    const response = await GET(mockRequest);
    expect(response?.status).toBe(200);

    const data = await response?.json();
    expect(data.meta).toMatchObject({
      page: 1, // Should default to 1
      limit: 1, // Should default to minimum 1
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });

    expect(mockPrisma.sailingActivity.findMany).toHaveBeenCalledWith({
      include: {
        boat: true,
      },
      orderBy: {
        id: "desc", // Should fallback to default sort
      },
      skip: 0,
      take: 1,
    });
  });

  it("should handle database errors when fetching activities", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.sailingActivity.findMany.mockRejectedValue(
      new Error("Database error")
    );

    // Create a mock request with URL
    const mockRequest = {
      url: "http://localhost:3000/api/activities?page=1&limit=10",
    } as NextRequest;

    const response = await GET(mockRequest);
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
    } as NextRequest;

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
    } as NextRequest;

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
    } as NextRequest;

    const response = await POST(mockRequest);
    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});
