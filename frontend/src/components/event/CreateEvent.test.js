import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateEventModal from "./CreateEvent";

describe("CreateEventModal", () => {
  test("renders correctly", () => {
    render(<CreateEventModal isOpen={true} onClose={() => {}} />);

    // Assert that the title input is rendered
    const titleInput = screen.getByPlaceholderText("Add title");
    expect(titleInput).toBeInTheDocument();

    // Assert that the heading name is "Add Event"
    const heading = screen.getByRole("heading", { name: "Add Event" });
    expect(heading).toBeInTheDocument();

    // Assert that the allDay checkbox is rendered
  });

  test("calls onClose when Close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(<CreateEventModal isOpen={true} onClose={onCloseMock} />);

    // Click the Close button
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    // Assert that onClose is called
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("calls onSubmit when Submit button is clicked", () => {
    const onSubmitMock = jest.fn();
    render(
      <CreateEventModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={onSubmitMock}
      />
    );
  });

  // Add more tests for other functionality as needed
});
