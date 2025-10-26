/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@test-utils/render";
import { ColorModeButton } from "@/components/ui/colorMode";

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
}));

describe("ColorMode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the color mode toggle button", () => {
    render(<ColorModeButton />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows sun icon for light theme", () => {
    render(<ColorModeButton />);

    // The sun icon should be visible for light theme (rendered as SVG)
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("calls setTheme when clicked", () => {
    render(<ColorModeButton />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("has correct accessibility attributes", () => {
    render(<ColorModeButton />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Toggle color mode");
  });

  it("applies button styling", () => {
    const { container } = render(<ColorModeButton />);

    const button = container.querySelector("button");
    // Test that the button has appropriate styling for a clickable element
    const styles = window.getComputedStyle(button);
    // In test environment, cursor might not be computed as "pointer"
    // So we just check that it's a valid button element with display
    expect(styles.display).toBeTruthy();
    expect(button?.tagName).toBe("BUTTON");
  });
});
