import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from ".";

describe("Header", () => {
  test("renders correctly", () => {
    render(<Header />);
    const logo = screen.getByAltText("logo");
    expect(logo).toBeTruthy();
  });
});
