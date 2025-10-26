/**
 * @jest-environment jsdom
 */

import { render, screen } from "@test-utils/render";
import { Card } from "@/components/card";

describe("Card", () => {
  it("renders children correctly", () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies visual styling", () => {
    const { container } = render(
      <Card>
        <div>Test content</div>
      </Card>
    );

    const cardElement = container.firstChild;
    // Test that the card has visual styling applied (border, shadow, etc.)
    const styles = window.getComputedStyle(cardElement as Element);
    expect(styles.borderRadius).toBeTruthy();
    // Check that border is not "none" (meaning it has some border styling)
    expect(styles.border).not.toBe("none");
    // Check that boxShadow is not "none" (meaning it has some shadow styling)
    expect(styles.boxShadow).not.toBe("none");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Test content</div>
      </Card>
    );

    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass("custom-class");
  });

  it("renders with custom props", () => {
    render(
      <Card data-testid="custom-card">
        <div>Test content</div>
      </Card>
    );

    const card = screen.getByTestId("custom-card");
    expect(card).toBeInTheDocument();
  });

  it("forwards other props", () => {
    render(
      <Card data-testid="card" role="region">
        <div>Test content</div>
      </Card>
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("role", "region");
  });
});
