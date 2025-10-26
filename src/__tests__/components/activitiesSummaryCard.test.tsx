/**
 * @jest-environment jsdom
 */

import { render, screen } from "@test-utils/render";
import { ActivitiesSummaryCard } from "@/components/activitiesSummaryCard";
import type { ApiActivitiesReport } from "@/types/api";

const mockReport: ApiActivitiesReport = {
  total: {
    hoursSailed: 25.5,
    nauticalMiles: 150,
    eventCount: 12,
  },
  byBoatType: {
    monohull: {
      hoursSailed: 20,
      nauticalMiles: 120,
      eventCount: 8,
    },
    catamaran: {
      hoursSailed: 5.5,
      nauticalMiles: 30,
      eventCount: 4,
    },
  },
  byActivityType: {
    cruising: {
      hoursSailed: 18,
      nauticalMiles: 100,
      eventCount: 9,
    },
    racing: {
      hoursSailed: 7.5,
      nauticalMiles: 50,
      eventCount: 3,
    },
  },
  byBoatLength: {
    "30-39": {
      hoursSailed: 15,
      nauticalMiles: 80,
      eventCount: 6,
    },
    "40-49": {
      hoursSailed: 10.5,
      nauticalMiles: 70,
      eventCount: 6,
    },
  },
};

describe("ActivitiesSummaryCard", () => {
  it("renders total metrics correctly", () => {
    render(<ActivitiesSummaryCard report={mockReport} />);

    expect(screen.getByText("26h")).toBeInTheDocument(); // hours sailed
    expect(screen.getByText("150 NM")).toBeInTheDocument(); // nautical miles
    expect(screen.getByText("12")).toBeInTheDocument(); // event count
  });

  it("renders labels correctly", () => {
    render(<ActivitiesSummaryCard report={mockReport} />);

    expect(screen.getByText("Total Hours Sailed")).toBeInTheDocument();
    expect(screen.getByText("Nautical Miles")).toBeInTheDocument();
    expect(screen.getByText("Activities")).toBeInTheDocument();
  });

  it("handles empty report gracefully", () => {
    const emptyReport: ApiActivitiesReport = {
      total: {
        hoursSailed: 0,
        nauticalMiles: 0,
        eventCount: 0,
      },
      byBoatType: {},
      byActivityType: {},
      byBoatLength: {},
    };

    render(<ActivitiesSummaryCard report={emptyReport} />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("formats numbers correctly", () => {
    render(<ActivitiesSummaryCard report={mockReport} />);

    // Check that hours are rounded and formatted with 'h' suffix
    expect(screen.getByText("26h")).toBeInTheDocument();
    // Check that distance is formatted with 'NM' suffix
    expect(screen.getByText("150 NM")).toBeInTheDocument();
  });
});
