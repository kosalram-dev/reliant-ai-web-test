import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Rating from ".";

describe("Rating", () => {
  test("renders correctly", () => {
    const rate = 4.5;
    const count = 120;

    render(<Rating rate={rate} count={count} />);

    // Check if all the stars are rendered correctly
    const fullStars = screen.getAllByAltText("full star");
    const halfStar = screen.getByAltText("half star");

    expect(fullStars.length).toBe(4);
    expect(halfStar).toBeTruthy();

    // Check if the rating text is rendered correctly
    const ratingText = screen.getByText(`${rate} out of 5`);
    expect(ratingText).toBeTruthy();
  });
});
