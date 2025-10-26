import { render, screen } from "@test-utils/render";
import { ActivitiesTable } from "@/components/activitiesTable";
import { ApiBoat, PaginatedActivitiesResponse } from "@/types/api";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    entries: jest.fn().mockReturnValue([]),
  }),
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock the pagination component
jest.mock("@/components/pagination", () => ({
  Pagination: ({ meta }: { meta: { page: number; totalPages: number } }) => (
    <div data-testid="pagination">
      Page {meta.page} of {meta.totalPages}
    </div>
  ),
}));

describe("ActivitiesTable", () => {
  const mockActivitiesData: PaginatedActivitiesResponse = {
    data: [
      {
        id: 1,
        startTime: "2024-01-15T10:00:00Z",
        endTime: "2024-01-15T14:00:00Z",
        departureLocation: "Marina A",
        returnLocation: "Marina B",
        distanceNm: 15.5,
        avgSpeedKnots: 5.2,
        weatherConditions: "Sunny",
        windSpeedKnots: 12,
        windDirection: "NW",
        seaState: "Calm",
        sailConfiguration: "Full main and jib",
        purpose: "cruising",
        notes: "Great day for sailing",
        boatId: 1,
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
        startTime: "2024-01-16T09:00:00Z",
        endTime: "2024-01-16T12:00:00Z",
        departureLocation: "Marina C",
        returnLocation: "Marina D",
        distanceNm: 8.2,
        avgSpeedKnots: 6.8,
        weatherConditions: "Partly cloudy",
        windSpeedKnots: 15,
        windDirection: "SE",
        seaState: "Moderate",
        sailConfiguration: "Main and genoa",
        purpose: "racing",
        notes: "Competitive race",
        boatId: 2,
        boat: {
          id: 2,
          name: "Test Boat",
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
    ],
    meta: {
      page: 1,
      limit: 3,
      total: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  it("renders activities table with data", () => {
    render(<ActivitiesTable data={mockActivitiesData} />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Boat")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Purpose")).toBeInTheDocument();
    expect(screen.getByText("Distance")).toBeInTheDocument();

    // Check that activities are rendered
    expect(screen.getAllByText("Test Boat")).toHaveLength(2);
    expect(screen.getByText("Cruising")).toBeInTheDocument();
    expect(screen.getByText("Racing")).toBeInTheDocument();
  });

  it("renders empty state when no activities", () => {
    const emptyData: PaginatedActivitiesResponse = {
      data: [],
      meta: {
        page: 1,
        limit: 3,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    render(<ActivitiesTable data={emptyData} />);

    expect(
      screen.getByText("No activities found. Log your first sailing adventure!")
    ).toBeInTheDocument();
    expect(screen.getByText("+ Log New Activity")).toBeInTheDocument();
  });

  it("renders pagination component when meta is present", () => {
    render(<ActivitiesTable data={mockActivitiesData} />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("displays formatted duration and distance", () => {
    render(<ActivitiesTable data={mockActivitiesData} />);

    // Check for duration (4 hours and 3 hours)
    expect(screen.getByText("4h 0m")).toBeInTheDocument();
    expect(screen.getByText("3h 0m")).toBeInTheDocument();
    // Check for distance with unit
    expect(screen.getByText("15.5 NM")).toBeInTheDocument();
    expect(screen.getByText("8.2 NM")).toBeInTheDocument();
  });

  it("renders boat color indicators", () => {
    render(<ActivitiesTable data={mockActivitiesData} />);

    const colorIndicators = screen.getAllByRole("generic");
    const colorBox = colorIndicators.find(
      (el) => el.style.backgroundColor === "rgb(255, 0, 0)"
    );
    expect(colorBox).toBeInTheDocument();
  });

  it("handles missing boat data gracefully", () => {
    const activitiesWithMissingBoat: PaginatedActivitiesResponse = {
      data: [
        {
          id: 1,
          startTime: "2024-01-15T10:00:00Z",
          endTime: "2024-01-15T14:00:00Z",
          departureLocation: "Marina A",
          returnLocation: "Marina B",
          distanceNm: 15.5,
          avgSpeedKnots: 5.2,
          weatherConditions: "Sunny",
          windSpeedKnots: 12,
          windDirection: "NW",
          seaState: "Calm",
          sailConfiguration: "Full main and jib",
          purpose: "cruising",
          notes: "Great day for sailing",
          boatId: 1,
          boat: null as unknown as ApiBoat,
        },
      ],
      meta: {
        page: 1,
        limit: 3,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    render(<ActivitiesTable data={activitiesWithMissingBoat} />);

    expect(screen.getByText("Unknown Boat")).toBeInTheDocument();
  });

  it("handles missing activity data gracefully", () => {
    const activitiesWithMissingData: PaginatedActivitiesResponse = {
      data: [
        {
          id: 1,
          startTime: "2024-01-15T10:00:00Z",
          endTime: "2024-01-15T14:00:00Z",
          departureLocation: "Marina A",
          returnLocation: "Marina B",
          distanceNm: null,
          avgSpeedKnots: null,
          weatherConditions: null,
          windSpeedKnots: null,
          windDirection: null,
          seaState: null,
          sailConfiguration: null,
          purpose: null,
          notes: null,
          boatId: 1,
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
      ],
      meta: {
        page: 1,
        limit: 3,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    render(<ActivitiesTable data={activitiesWithMissingData} />);

    // Check that missing data shows as "-"
    const dashElements = screen.getAllByText("-");
    expect(dashElements).toHaveLength(2); // purpose and distance
  });
});
