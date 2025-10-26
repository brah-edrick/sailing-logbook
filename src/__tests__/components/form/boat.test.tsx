/**
 * @jest-environment jsdom
 */

import { render, screen } from "@test-utils/render";
import { EditBoatForm, NewBoatForm } from "@/components/form/boat";
import type { ApiBoat } from "@/types/api";

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

const mockBoat: ApiBoat = {
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
};

describe("EditBoatForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch for API calls
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBoat),
    });
  });

  it("renders with edit title", () => {
    render(<EditBoatForm boat={mockBoat} />);

    expect(screen.getByText("Edit Boat")).toBeInTheDocument();
  });

  it("passes boat data to BoatForm", () => {
    render(<EditBoatForm boat={mockBoat} />);

    expect(screen.getByDisplayValue("Test Boat")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Make")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<EditBoatForm boat={mockBoat} />);

    expect(
      screen.getByRole("button", { name: /update boat/i })
    ).toBeInTheDocument();
  });
});

describe("NewBoatForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch for API calls
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 1 }),
    });
  });

  it("renders with new title", () => {
    render(<NewBoatForm />);

    expect(screen.getByText("Add New Boat")).toBeInTheDocument();
  });

  it("renders empty form", () => {
    render(<NewBoatForm />);

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toHaveValue("");
  });

  it("renders submit button", () => {
    render(<NewBoatForm />);

    expect(
      screen.getByRole("button", { name: /add boat/i })
    ).toBeInTheDocument();
  });
});
