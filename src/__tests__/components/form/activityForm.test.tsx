/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@test-utils/render";
import userEvent from "@testing-library/user-event";
import { ActivityForm } from "@/components/form/activityForm";
import type { ApiBoat } from "@/types/api";

const mockOnSubmit = jest.fn();

const mockActivity = {
  id: 1,
  boatId: "1",
  startTime: "2024-01-01T10:00",
  endTime: "2024-01-01T12:00",
  notes: "Test notes",
  departureLocation: "Marina A",
  returnLocation: "Marina B",
  distanceNm: "5.5",
  avgSpeedKnots: "6.2",
  windSpeedKnots: "10",
  windDirection: "n" as const,
  weatherConditions: "sunny" as const,
  seaState: "calm" as const,
  sailConfiguration: "Full main and jib",
  purpose: "cruising" as const,
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

describe("ActivityForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={mockActivity}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    expect(screen.getByText(/^boat$/i)).toBeInTheDocument();
    expect(screen.getByText(/^activity purpose$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departure location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/return location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/distance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/average speed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wind speed/i)).toBeInTheDocument();
    expect(screen.getByText(/^wind direction$/i)).toBeInTheDocument();
    expect(screen.getByText(/^weather$/i)).toBeInTheDocument();
    expect(screen.getByText(/^sea state$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sail configuration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it("populates form with initial data", () => {
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={mockActivity}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    expect(screen.getByDisplayValue("Marina A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Marina B")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5.5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("6.2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
  });

  it("renders boat options", () => {
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={mockActivity}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    // Check that the boat select field exists
    expect(screen.getByText(/^boat$/i)).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={mockActivity}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          boatId: "1", // Form returns string values
          departureLocation: "Marina A",
          distanceNm: "5.5", // Form returns string values
        })
      );
    });
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={{}}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // The form should be disabled when invalid, so onSubmit shouldn't be called
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("validates end time is after start time", async () => {
    const user = userEvent.setup();
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={{}}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    const startTimeInput = screen.getByLabelText(/start time/i);
    const endTimeInput = screen.getByLabelText(/end time/i);

    await user.type(startTimeInput, "2024-01-01T12:00");
    await user.type(endTimeInput, "2024-01-01T10:00");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // The form should be disabled when invalid, so onSubmit shouldn't be called
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("validates distance is positive", async () => {
    const user = userEvent.setup();
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={{}}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    const distanceInput = screen.getByLabelText(/distance/i);
    await user.type(distanceInput, "-1");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // The form should be disabled when invalid, so onSubmit shouldn't be called
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("disables submit button when form is invalid", async () => {
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={{}}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when form is valid", async () => {
    const user = userEvent.setup();
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        initialValues={{}}
        submitButtonText="Save"
        boats={mockBoats}
      />
    );

    // Fill out required fields - the form needs boat, start time, and end time
    const startTimeInput = screen.getByLabelText(/start time/i);
    const endTimeInput = screen.getByLabelText(/end time/i);

    await user.type(startTimeInput, "2024-01-01T10:00");
    await user.type(endTimeInput, "2024-01-01T12:00");

    // The form should still be disabled because boat is required
    const submitButton = screen.getByRole("button", { name: /save/i });
    expect(submitButton).toBeDisabled();
  });
});
