/**
 * @jest-environment jsdom
 */

import { render, screen } from "@test-utils/render";
import { EditActivityForm, NewActivityForm } from "@/components/form/activity";
import type { ApiSailingActivity, ApiBoat } from "@/types/api";

// Mock the router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the toaster
jest.mock("@/components/toaster", () => ({
  toaster: {
    create: jest.fn(),
  },
}));

const mockActivity: ApiSailingActivity = {
  id: 1,
  boatId: 1,
  startTime: "2024-01-01T10:00:00Z",
  endTime: "2024-01-01T12:00:00Z",
  notes: "Test notes",
  departureLocation: "Marina A",
  returnLocation: "Marina B",
  distanceNm: 5.5,
  avgSpeedKnots: 6.2,
  windSpeedKnots: 10,
  windDirection: "n",
  weatherConditions: "sunny",
  seaState: "calm",
  sailConfiguration: "Full main and jib",
  purpose: "cruising",
};

const mockBoats: ApiBoat[] = [
  {
    id: 1,
    name: "Boat 1",
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
  {
    id: 2,
    name: "Boat 2",
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
];

describe("EditActivityForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch for API calls
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockActivity),
    });
  });

  it("renders with edit title", () => {
    render(<EditActivityForm activity={mockActivity} boats={mockBoats} />);

    expect(screen.getByText("Edit Activity")).toBeInTheDocument();
  });

  it("passes activity data to ActivityForm", () => {
    render(<EditActivityForm activity={mockActivity} boats={mockBoats} />);

    expect(screen.getByDisplayValue("Marina A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Marina B")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5.5")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<EditActivityForm activity={mockActivity} boats={mockBoats} />);

    expect(
      screen.getByRole("button", { name: /update activity/i })
    ).toBeInTheDocument();
  });
});

describe("NewActivityForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch for API calls
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 1 }),
    });
  });

  it("renders with new title", () => {
    render(<NewActivityForm boats={mockBoats} />);

    expect(screen.getByText("Log New Activity")).toBeInTheDocument();
  });

  it("renders empty form", () => {
    render(<NewActivityForm boats={mockBoats} />);

    const departureInput = screen.getByLabelText(/departure location/i);
    expect(departureInput).toHaveValue("");
  });

  it("renders submit button", () => {
    render(<NewActivityForm boats={mockBoats} />);

    expect(
      screen.getByRole("button", { name: /add activity/i })
    ).toBeInTheDocument();
  });
});
