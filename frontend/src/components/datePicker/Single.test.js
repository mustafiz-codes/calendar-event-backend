import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SingleDatePicker from "./Single";
import { CalendarProvider } from "../../context/CalendarContext";

describe("SingleDatePicker component", () => {
  test("renders SingleDatePicker component", () => {
    render(
      <CalendarProvider>
        <SingleDatePicker />
      </CalendarProvider>
    );
    expect(screen.getByTestId("single-date-picker")).toBeInTheDocument();
  });
});
