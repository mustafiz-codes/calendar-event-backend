# Calendar Event Management System

This project is a full-stack application that provides backend services for a calendar event management system, along with a frontend user interface. The backend is built with Node.js and Express, using TypeScript, and connects to a MongoDB database. The frontend is a React application that communicates with the backend API.

## Features

- Event creation, modification, and deletion.
- User authentication and authorization (assumed features based on typical calendar event systems).
- Responsive frontend design.
- Dockerized environment for easy setup and deployment.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/).
- You have installed [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose.
- You have a basic understanding of TypeScript, React, and Docker.

## Installing Calendar Event Management System

To install Calendar Event Management System, follow these steps:

1. Clone the repository:
   `git clone https://github.com/yourusername/calendar-event-backend.git`
2. Navigate to the project directory:
   `cd calendar-event-backend`
3. Use the `install-all` script to install dependencies for both frontend and backend
   `npm run install-all`

## Using Calendar Event Management System

To use Calendar Event Management System, follow these steps:

- To run the project without Docker:

  - For the backend:  
    `npm run dev`
  - For the frontend, open a new terminal and run:  
    `npm run start-frontend`

- To run the project with Docker:
  - Build the Docker images:  
    `npm run docker:rebuild`
  - Start the Docker containers:
    `npm run docker:up`
  - The frontend will be available at `http://localhost:3000` and the backend at
    `http://localhost:5000`.
- To stop and remove Docker containers:
  `npm run docker:down`

## Running Tests

To run tests, execute the following command:

- for backend
  `npm run test`

- for frontend
  `cd ./frontend && npm test`

- test both
  `npm run test && npm run test:frontend`

## **API Endpoints**

# API Endpoints

- `POST /events`: Create a new event.
- `GET /`: Get all events.
- `GET /events/:id`: Get a specific event by its ID.
- `PUT /events/:id`: Update an event by its ID.
- `DELETE /events/:id`: Delete an event by its ID.
- `GET /range`: Get events within a specified range.

# Router Handlers

- `getEventsByRange`: Handler for the `GET /range` endpoint.
- `getEventById`: Handler for the `GET /events/:id` endpoint.
- `updateEventById`: Handler for the `PUT /events/:id` endpoint.
- `updateRecurringEvents`: Handler for the `PUT /recurring/:recurringEventId` endpoint.
- `deleteEventById`: Handler for the `DELETE /events/:id` endpoint.
- `deleteRecurringEvents`: Handler for the `DELETE /recurring/:recurringEventId` endpoint.

# Calendar Application Feature Details

## Overview

This document outlines the user interface and core functionality of the Calendar Application. It provides a dynamic interface for event management, supporting various views and themes. The application is built with responsiveness in mind, adapting to both month and week views.

## User Interface

### Top Bar Features

1.  **Navigation Arrows (`<` `>`):**

    - Navigate to the next or previous time frame.
    - Context-sensitive: adapts to month or week view.

2.  **Today Button:**

    - Quick access to the current date's view.

3.  **View Dropdown:**

    - Switch between month and week views.

4.  **Theme Changer:**

    - Toggle between dark and light themes.

5.  **Create Event Button:**

    - Initiates the event creation process.

### SideBar Features

1.  **Quick Event Creation Button:**

    - An additional interface for initiating new event creation.

2.  **Mini Month Calendar:**

    - Provides an overview of the month and quick navigation.
    - Built from scratch with Tailwind CSS.

### Main Content

- Displays the calendar with events in month or week views.

## Themes

- Supports dark and light modes for user preference.

## Core Functionalities

### Event Creation

1.  **Single Day Event:**

    - Create events for a specific day, with options for all-day or timed events.

2.  **Multi-Day Event:**

    - Span events across multiple days.
    - Options for all-day or timed events, including recurring events.

### Event Update

1.  **Single Event Update:**

    - Modify any attribute of a single event.

2.  **Recurring Event Update:**

    - Adjust specific instances within a series or update the series as a whole.
    - Series-wide changes are limited to time, title, notes, and description.

### Event Deletion

1.  **Single Event Deletion:**

    - Remove any single event.

2.  **Recurring Event Deletion:**

    - Option to delete the entire series.

## Suggested Improvements

1.  **Confirmation Prompts:**

    - Implement confirmation dialogs for deleting events to prevent accidental data loss.

2.  **Undo Functionality:**

    - Offer an undo option for recent changes.

3.  **Drag-and-Drop:**

    - Introduce drag-and-drop to re-schedule events quickly.

4.  **Search Function:**

    - Implement a search bar to find events efficiently.

5.  **Integration with External Calendars:**

    - Allow synchronization with third-party calendar services.

6.  **Responsive Design Check:**

    - Ensure the UI scales gracefully on various devices and screen sizes.

7.  **Accessibility Considerations:**

    - Include keyboard navigation and screen reader support.

8.  **Testing:**

    - Conduct thorough testing, including unit tests for the frontend components and integration tests for the full application stack.

## Conclusion

This documentation provides a foundational understanding of the Calendar Application's interface and functionality. The suggested improvements aim to enhance user experience and application robustness. Future development should also consider user feedback and iterative design improvements.

---

Developers are encouraged to contribute to the documentation, keeping it up-to-date with any new features or changes to the application.

## **Author**

Mustafizur Rahman Choudhury
