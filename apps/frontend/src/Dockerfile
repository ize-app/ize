# apps/frontend/Dockerfile

# Purpose of this Dockerfile is creating the production build of the frontend app.
# During development, the frontend app is served by Vite's development server.

# Build the React app with Vite
FROM node:14 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# This stage is just to output the build directory. It won't be used directly in docker-compose.prod.yml.
