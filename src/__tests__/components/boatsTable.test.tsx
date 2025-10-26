import { render, screen } from "@test-utils/render";
import { BoatsTable } from "@/components/boatsTable";
import { PaginatedBoatsResponse } from "@/types/api";

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

describe("BoatsTable", () => {
  const mockBoatsData: PaginatedBoatsResponse = {
    data: [
      {
        id: 1,
        name: "Test Boat 1",
        type: "monohull",
        make: "Beneteau",
        model: "Oceanis 40",
        year: 2020,
        lengthFt: 40,
        beamFt: 12,
        sailNumber: "12345",
        homePort: "Test Port",
        owner: "Test Owner",
        notes: "Test notes",
        colorHex: "#FF0000",
      },
      {
        id: 2,
        name: "Test Boat 2",
        type: "catamaran",
        make: "Jeanneau",
        model: "Sun Odyssey 349",
        year: 2019,
        lengthFt: 34,
        beamFt: 14,
        sailNumber: "67890",
        homePort: "Test Port 2",
        owner: "Test Owner 2",
        notes: "Test notes 2",
        colorHex: "#00FF00",
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

  it("renders boats table with data", () => {
    render(<BoatsTable data={mockBoatsData} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Make")).toBeInTheDocument();
    expect(screen.getByText("Model")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Length")).toBeInTheDocument();

    // Check that boats are rendered
    expect(screen.getByText("Test Boat 1")).toBeInTheDocument();
    expect(screen.getByText("Test Boat 2")).toBeInTheDocument();
    expect(screen.getByText("Beneteau")).toBeInTheDocument();
    expect(screen.getByText("Jeanneau")).toBeInTheDocument();
    expect(screen.getByText("Oceanis 40")).toBeInTheDocument();
    expect(screen.getByText("Sun Odyssey 349")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
    expect(screen.getByText("2019")).toBeInTheDocument();
  });

  it("renders empty state when no boats", () => {
    const emptyData: PaginatedBoatsResponse = {
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

    render(<BoatsTable data={emptyData} />);

    expect(
      screen.getByText("No boats found. Add your first boat!")
    ).toBeInTheDocument();
    expect(screen.getByText("+ Add New Boat")).toBeInTheDocument();
  });

  it("renders pagination component when meta is present", () => {
    render(<BoatsTable data={mockBoatsData} />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("displays formatted length with unit", () => {
    render(<BoatsTable data={mockBoatsData} />);

    expect(screen.getByText("40 ft")).toBeInTheDocument();
    expect(screen.getByText("34 ft")).toBeInTheDocument();
  });

  it("renders boat color indicators", () => {
    render(<BoatsTable data={mockBoatsData} />);

    const colorIndicators = screen.getAllByRole("generic");
    const redBox = colorIndicators.find(
      (el) => el.style.backgroundColor === "rgb(255, 0, 0)"
    );
    const greenBox = colorIndicators.find(
      (el) => el.style.backgroundColor === "rgb(0, 255, 0)"
    );
    expect(redBox).toBeInTheDocument();
    expect(greenBox).toBeInTheDocument();
  });

  it("handles missing boat data gracefully", () => {
    const boatsWithMissingData: PaginatedBoatsResponse = {
      data: [
        {
          id: 1,
          name: "Test Boat",
          type: "monohull",
          make: null as unknown as string,
          model: null as unknown as string,
          year: null as unknown as number,
          lengthFt: null as unknown as number,
          beamFt: null,
          sailNumber: null,
          homePort: null,
          owner: null,
          notes: null,
          colorHex: "#FF0000",
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

    render(<BoatsTable data={boatsWithMissingData} />);

    expect(screen.getByText("Test Boat")).toBeInTheDocument();
    // Check that missing data shows as "-"
    const dashElements = screen.getAllByText("-");
    expect(dashElements).toHaveLength(4); // make, model, year, length
  });
});
