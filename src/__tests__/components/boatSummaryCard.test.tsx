/**
 * @jest-environment jsdom
 */

import { render, screen } from "@test-utils/render";
import { BoatSummaryCard } from "@/components/boatSummaryCard";
import type { ApiBoatReport } from "@/types/api";

const mockReport: ApiBoatReport = {
  boatId: 1,
  boatName: "Test Boat",
  total: {
    hoursSailed: 15.5,
    nauticalMiles: 85,
    eventCount: 8,
  },
  byActivityType: {
    cruising: {
      hoursSailed: 12,
      nauticalMiles: 60,
      eventCount: 6,
    },
    racing: {
      hoursSailed: 3.5,
      nauticalMiles: 25,
      eventCount: 2,
    },
  },
  byMonth: {
    "2024-01": {
      hoursSailed: 8,
      nauticalMiles: 40,
      eventCount: 4,
    },
    "2024-02": {
      hoursSailed: 7.5,
      nauticalMiles: 45,
      eventCount: 4,
    },
  },
  byYear: {
    "2024": {
      hoursSailed: 15.5,
      nauticalMiles: 85,
      eventCount: 8,
    },
  },
};

describe("BoatSummaryCard", () => {
  it("renders total metrics correctly", () => {
    render(<BoatSummaryCard report={mockReport} />);

    expect(screen.getByText("16h")).toBeInTheDocument(); // hours sailed (rounded)
    expect(screen.getByText("85 NM")).toBeInTheDocument(); // nautical miles
    expect(screen.getByText("8")).toBeInTheDocument(); // event count
  });

  it("renders labels correctly", () => {
    render(<BoatSummaryCard report={mockReport} />);

    expect(screen.getByText("Hours Sailed")).toBeInTheDocument();
    expect(screen.getByText("Nautical Miles")).toBeInTheDocument();
    expect(screen.getByText("Activities")).toBeInTheDocument();
  });

  it("handles empty report gracefully", () => {
    const emptyReport: ApiBoatReport = {
      boatId: 1,
      boatName: "Empty Boat",
      total: {
        hoursSailed: 0,
        nauticalMiles: 0,
        eventCount: 0,
      },
      byActivityType: {},
      byMonth: {},
      byYear: {},
    };

    render(<BoatSummaryCard report={emptyReport} />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("0 NM")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("formats numbers correctly", () => {
    render(<BoatSummaryCard report={mockReport} />);

    // Check that hours are rounded and formatted with 'h' suffix
    expect(screen.getByText("16h")).toBeInTheDocument();
    // Check that distance is formatted with 'NM' suffix
    expect(screen.getByText("85 NM")).toBeInTheDocument();
  });
});
