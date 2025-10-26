/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@test-utils/render";
import userEvent from "@testing-library/user-event";
import { SafeDeleteEntityButton } from "@/components/safeDeleteEntityButton";

const mockOnSuccess = jest.fn();

// Mock fetch globally
global.fetch = jest.fn();

describe("SafeDeleteEntityButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  it("renders the delete button", () => {
    render(
      <SafeDeleteEntityButton
        entityId={1}
        entityName="Test Entity"
        entityType="boat"
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("shows confirmation dialog when clicked", async () => {
    const user = userEvent.setup();
    render(
      <SafeDeleteEntityButton
        entityId={1}
        entityName="Test Entity"
        entityType="boat"
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(screen.getByText("Delete Boat")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete Test Entity?")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm delete test entity/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onSuccess when confirmed and API call succeeds", async () => {
    const user = userEvent.setup();
    render(
      <SafeDeleteEntityButton
        entityId={1}
        entityName="Test Entity"
        entityType="boat"
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", {
      name: /confirm delete test entity/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/boats/1", {
        method: "DELETE",
      });
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("does not call onSuccess when cancelled", async () => {
    const user = userEvent.setup();
    render(
      <SafeDeleteEntityButton
        entityId={1}
        entityName="Test Entity"
        entityType="boat"
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("closes dialog when cancelled", async () => {
    const user = userEvent.setup();
    render(
      <SafeDeleteEntityButton
        entityId={1}
        entityName="Test Entity"
        entityType="boat"
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(screen.getByText("Delete Boat")).toBeInTheDocument(); // Dialog is open

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() =>
      expect(screen.queryByText("Delete Boat")).not.toBeInTheDocument()
    ); // Dialog is closed
  });

  it("closes dialog when confirmed", async () => {
    const user = userEvent.setup();
    render(
      <SafeDeleteEntityButton
        entityId={1}
        entityName="Test Entity"
        entityType="boat"
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(screen.getByText("Delete Boat")).toBeInTheDocument(); // Dialog is open

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmButton);

    await waitFor(() =>
      expect(screen.queryByText("Delete Boat")).not.toBeInTheDocument()
    ); // Dialog is closed
  });

  it("applies custom className", () => {
    render(
      <SafeDeleteEntityButton
        entityId={1}
        entityName="Test Entity"
        entityType="boat"
        onSuccess={mockOnSuccess}
        className="custom-class"
      />
    );

    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("custom-class");
  });
});
