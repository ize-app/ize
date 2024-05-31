# apps/backend/Dockerfile

# Final stage: Build the backend with the frontend's static assets
FROM node:14
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Copy frontend build files into the backend public directory
COPY --from=frontend-builder /app/dist /app/public

EXPOSE 3000
CMD ["node", "src/index.js"]
