/**
 * @jest-environment node
 */

// Mock the reports utilities
jest.mock("@/utils/reports", () => ({
  calculateTotalMetrics: jest.fn(),
  groupByActivityType: jest.fn(),
  groupActivitiesByField: jest.fn(),
}));

import { GET } from "@/app/api/boats/[id]/reports/route";
import { prisma } from "@/lib/prisma";
import {
  calculateTotalMetrics,
  groupByActivityType,
  groupActivitiesByField,
} from "@/utils/reports";
import { suppressConsoleError } from "@test-utils/console";

const mockPrisma = jest.mocked(prisma);
const mockCalculateTotalMetrics = jest.mocked(calculateTotalMetrics);
const mockGroupByActivityType = jest.mocked(groupByActivityType);
const mockGroupActivitiesByField = jest.mocked(groupActivitiesByField);

describe("GET /api/boats/[id]/reports", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a complete boat report", async () => {
    const mockBoat = {
      id: 1,
      name: "Test Boat",
      model: null,
      type: "monohull",
      make: "Test Make",
      year: 2020,
      lengthFt: 30,
      beamFt: null,
      sailNumber: null,
      homePort: null,
      owner: null,
      notes: null,
      colorHex: null,
    };

    const mockActivities = [
      {
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
        boat: {
          id: 1,
          type: "monohull",
          lengthFt: 30,
          beamFt: null,
          name: "Test Boat",
          make: "Test Make",
          model: null,
          sailNumber: null,
          homePort: null,
          owner: null,
          notes: null,
          colorHex: null,
        },
      },
    ];

    const mockTotal = {
      hoursSailed: 2,
      nauticalMiles: 5,
      eventCount: 1,
    };

    const mockByActivityType = {
      cruising: { hoursSailed: 2, nauticalMiles: 5, eventCount: 1 },
    };

    const mockByMonth = {
      "2024-01": { hoursSailed: 2, nauticalMiles: 5, eventCount: 1 },
    };

    const mockByYear = {
      "2024": { hoursSailed: 2, nauticalMiles: 5, eventCount: 1 },
    };

    mockPrisma.boat.findUnique.mockResolvedValue(mockBoat);
    mockPrisma.sailingActivity.findMany.mockResolvedValue(mockActivities);
    mockCalculateTotalMetrics.mockReturnValue(mockTotal);
    mockGroupByActivityType.mockReturnValue(mockByActivityType);
    mockGroupActivitiesByField
      .mockReturnValueOnce(mockByMonth)
      .mockReturnValueOnce(mockByYear);

    const response = await GET({} as any, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual({
      boatId: 1,
      boatName: "Test Boat",
      total: mockTotal,
      byActivityType: mockByActivityType,
      byMonth: mockByMonth,
      byYear: mockByYear,
    });

    expect(mockPrisma.boat.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true, name: true },
    });
    expect(mockPrisma.sailingActivity.findMany).toHaveBeenCalledWith({
      where: { boatId: 1 },
      include: {
        boat: {
          select: { id: true, type: true, lengthFt: true },
        },
      },
      orderBy: { startTime: "desc" },
    });
  });

  it("should return 400 for invalid boat ID", async () => {
    const response = await GET({} as any, {
      params: Promise.resolve({ id: "invalid" }),
    });

    expect(response?.status).toBe(400);
    const data = await response?.json();
    expect(data).toEqual({ error: "Invalid boat ID" });
  });

  it("should return 404 when boat not found", async () => {
    mockPrisma.boat.findUnique.mockResolvedValue(null);

    const response = await GET({} as any, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response?.status).toBe(404);
    const data = await response?.json();
    expect(data).toEqual({ error: "Boat not found" });
  });

  it("should handle empty activities list", async () => {
    const mockBoat = {
      id: 1,
      name: "Test Boat",
      model: null,
      type: "monohull",
      make: "Test Make",
      year: 2020,
      lengthFt: 30,
      beamFt: null,
      sailNumber: null,
      homePort: null,
      owner: null,
      notes: null,
      colorHex: null,
    };

    const mockTotal = {
      hoursSailed: 0,
      nauticalMiles: 0,
      eventCount: 0,
    };

    mockPrisma.boat.findUnique.mockResolvedValue(mockBoat);
    mockPrisma.sailingActivity.findMany.mockResolvedValue([]);
    mockCalculateTotalMetrics.mockReturnValue(mockTotal);
    mockGroupByActivityType.mockReturnValue({});
    mockGroupActivitiesByField.mockReturnValueOnce({}).mockReturnValueOnce({});

    const response = await GET({} as any, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual({
      boatId: 1,
      boatName: "Test Boat",
      total: mockTotal,
      byActivityType: {},
      byMonth: {},
      byYear: {},
    });
  });

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.boat.findUnique.mockRejectedValue(new Error("Database error"));

    const response = await GET({} as any, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});
