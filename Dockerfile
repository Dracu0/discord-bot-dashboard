# syntax = docker/dockerfile:1

# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy frontend source and build
COPY public/ public/
COPY src/ src/
COPY jsconfig.json ./

ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine

WORKDIR /app

# Install server dependencies only
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/src/ ./server/src/

# Copy React build from stage 1
COPY --from=frontend-build /app/build ./build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server/src/index.js"]
