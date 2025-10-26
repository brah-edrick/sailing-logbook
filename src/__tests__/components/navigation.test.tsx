/**
 * @jest-environment jsdom
 */

import { render, screen } from "@test-utils/render";
import { Navigation } from "@/components/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/activities",
}));

describe("Navigation", () => {
  it("renders the navigation with sailboat emoji", () => {
    render(<Navigation />);

    expect(screen.getByText("⛵ Sailing Log")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Navigation />);

    expect(
      screen.getByRole("link", { name: /activities/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /boats/i })).toBeInTheDocument();
  });

  it("applies different styling to active vs inactive links", () => {
    render(<Navigation />);

    const activitiesLink = screen.getByRole("link", { name: /activities/i });
    const boatsLink = screen.getByRole("link", { name: /boats/i });

    // Test that active and inactive links have different styling
    // We don't test specific values, just that they're different
    const activitiesStyles = window.getComputedStyle(activitiesLink);
    const boatsStyles = window.getComputedStyle(boatsLink);

    expect(activitiesStyles.color).not.toBe(boatsStyles.color);
    expect(activitiesStyles.fontWeight).not.toBe(boatsStyles.fontWeight);
  });

  it("has correct href attributes", () => {
    render(<Navigation />);

    const activitiesLink = screen.getByRole("link", { name: /activities/i });
    const boatsLink = screen.getByRole("link", { name: /boats/i });

    expect(activitiesLink).toHaveAttribute("href", "/activities");
    expect(boatsLink).toHaveAttribute("href", "/boats");
  });

  it("applies sticky positioning", () => {
    const { container } = render(<Navigation />);

    const navElement = container.firstChild;
    // Test the actual CSS properties instead of generated class names
    expect(navElement).toHaveStyle("position: sticky");
    expect(navElement).toHaveStyle("top: 0px");
    expect(navElement).toHaveStyle("z-index: 10");
  });
});
