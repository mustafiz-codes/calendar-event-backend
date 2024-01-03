import React from "react";
import { render, screen } from "@testing-library/react";
import MonthlyView from "./Monthly";

test("renders MonthlyView component", () => {
  render(<MonthlyView />);
  const monthlyViewElement = screen.getByText(/Mon/i);
  expect(monthlyViewElement).toBeInTheDocument();
});
