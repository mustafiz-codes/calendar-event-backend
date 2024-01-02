def add_numbers(a, b):
"""
Adds two numbers together and returns the result.

    Parameters:
    a (int): The first number.
    b (int): The second number.

    Returns:
    int: The sum of the two numbers.
    """
    return a + b

## Calendar Event Backend

This project is a backend service for a calendar event application. It provides API endpoints to create, read, update, and delete calendar events.

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- npm or yarn
- MongoDB

### Installing

A step by step series of examples that tell you how to get a development environment running.

First, clone the repository to your local machine:  
`git clone` [`https://your-repository-url-here.git`](https://your-repository-url-here.git)

Navigate to the cloned directory:

`cd calendar-event-backend`

Install the project dependencies:

`npm install`

or if you are using yarn:

`yarn install`

### **Running the project**

To start the development server, run:  
`npm run dev`

or if you are using yarn:

`yarn dev`

The server should now be running and listening for API requests on **http://localhost:5000**.

**API Documentation**

(Here you can add information about the API endpoints, request types, response examples, etc.)

## **Built With**

- [Express](https://expressjs.com/) - The web framework used
- [MongoDB](https://www.mongodb.com/) - The database used
- [Node.js](https://nodejs.org/) - The runtime environment used

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

## **Author**

Mustafizur Rahman Choudhury
