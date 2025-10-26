/**
 * @jest-environment node
 */

import { GET } from "@/app/api/boats/[id]/activities/route";
import { prisma } from "@/lib/prisma";
import type { SailingActivity } from "@prisma/client";
import { suppressConsoleError } from "@test-utils/console";

type SailingActivityWithBoat = SailingActivity & {
  boat: {
    id: number;
    name: string;
  };
};

const mockPrisma = jest.mocked(prisma);

describe("GET /api/boats/[id]/activities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return activities for a boat", async () => {
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
        purpose: "cruising",
        boat: { id: 1, name: "Test Boat" },
      },
      {
        id: 2,
        boatId: 1,
        startTime: new Date("2024-01-02T10:00:00Z"),
        endTime: new Date("2024-01-02T12:00:00Z"),
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
        purpose: "cruising",
        boat: { id: 1, name: "Test Boat" },
      },
    ] as SailingActivityWithBoat[];

    mockPrisma.sailingActivity.findMany.mockResolvedValue(mockActivities);

    const mockParams = Promise.resolve({ id: "1" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual(JSON.parse(JSON.stringify(mockActivities)));
    expect(mockPrisma.sailingActivity.findMany).toHaveBeenCalledWith({
      where: { boatId: 1 },
      include: { boat: true },
      orderBy: { startTime: "desc" },
    });
  });

  it("should return empty array when no activities found", async () => {
    mockPrisma.sailingActivity.findMany.mockResolvedValue([]);

    const mockParams = Promise.resolve({ id: "999" });
    const response = await GET({} as Request, { params: mockParams });

    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual([]);
    expect(mockPrisma.sailingActivity.findMany).toHaveBeenCalledWith({
      where: { boatId: 999 },
      include: { boat: true },
      orderBy: { startTime: "desc" },
    });
  });

  it("should handle database errors", async () => {
    const restoreConsole = suppressConsoleError();

    mockPrisma.sailingActivity.findMany.mockRejectedValue(
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
