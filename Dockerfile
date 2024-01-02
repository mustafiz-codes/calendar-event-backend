# Use a base image
FROM node:14

# Set the working directory

WORKDIR /src/index

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


RUN npm install

# Expose the port
EXPOSE 5000

# Start the application

RUN npm install

