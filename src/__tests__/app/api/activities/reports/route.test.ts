/**
 * @jest-environment node
 */

// Mock the reports utilities
jest.mock("@/utils/reports", () => ({
  calculateTotalMetrics: jest.fn(),
  groupByBoatType: jest.fn(),
  groupByActivityType: jest.fn(),
  groupByBoatLength: jest.fn(),
}));

import { GET } from "@/app/api/activities/reports/route";
import { prisma } from "@/lib/prisma";
import {
  calculateTotalMetrics,
  groupByBoatType,
  groupByActivityType,
  groupByBoatLength,
} from "@/utils/reports";
import { suppressConsoleError } from "@test-utils/console";

const mockPrisma = jest.mocked(prisma);
const mockCalculateTotalMetrics = jest.mocked(calculateTotalMetrics);
const mockGroupByBoatType = jest.mocked(groupByBoatType);
const mockGroupByActivityType = jest.mocked(groupByActivityType);
const mockGroupByBoatLength = jest.mocked(groupByBoatLength);

describe("GET /api/activities/reports", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a complete report", async () => {
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
        boat: { id: 1, name: "Test Boat", type: "monohull", lengthFt: 30 },
      },
    ];

    const mockTotal = {
      hoursSailed: 2,
      nauticalMiles: 5,
      eventCount: 1,
    };

    const mockByBoatType = {
      sailboat: { hoursSailed: 2, nauticalMiles: 5, eventCount: 1 },
    };

    const mockByActivityType = {
      cruising: { hoursSailed: 2, nauticalMiles: 5, eventCount: 1 },
    };

    const mockByBoatLength = {
      "30-39": { hoursSailed: 2, nauticalMiles: 5, eventCount: 1 },
    };

    mockPrisma.sailingActivity.findMany.mockResolvedValue(mockActivities);
    mockCalculateTotalMetrics.mockReturnValue(mockTotal);
    mockGroupByBoatType.mockReturnValue(mockByBoatType);
    mockGroupByActivityType.mockReturnValue(mockByActivityType);
    mockGroupByBoatLength.mockReturnValue(mockByBoatLength);

    const response = await GET({} as any);

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual({
      total: mockTotal,
      byBoatType: mockByBoatType,
      byActivityType: mockByActivityType,
      byBoatLength: mockByBoatLength,
    });

    expect(mockPrisma.sailingActivity.findMany).toHaveBeenCalledWith({
      include: { boat: true },
    });
  });

  it("should handle empty activities list", async () => {
    const mockTotal = {
      hoursSailed: 0,
      nauticalMiles: 0,
      eventCount: 0,
    };

    mockPrisma.sailingActivity.findMany.mockResolvedValue([]);
    mockCalculateTotalMetrics.mockReturnValue(mockTotal);
    mockGroupByBoatType.mockReturnValue({});
    mockGroupByActivityType.mockReturnValue({});
    mockGroupByBoatLength.mockReturnValue({});

    const response = await GET({} as any);

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual({
      total: mockTotal,
      byBoatType: {},
      byActivityType: {},
      byBoatLength: {},
    });
  });

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.sailingActivity.findMany.mockRejectedValue(
      new Error("Database error")
    );

    const response = await GET({} as any);

    expect(response?.status).toBe(500);
    const data = await response?.json();
    expect(data).toEqual({ error: "Internal server error" });

    restoreConsole();
  });
});
