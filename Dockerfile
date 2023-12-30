FROM node:16.19-alpine

WORKDIR /src/index
COPY package*.json ./
RUN npm i
COPY . .
RUN npm install
EXPOSE 5000