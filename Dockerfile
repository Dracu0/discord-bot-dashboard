# syntax = docker/dockerfile:1

# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source and build
COPY public/ public/
COPY src/ src/
COPY index.html ./
COPY jsconfig.json ./
COPY vite.config.js ./

ENV NODE_ENV=production
ENV INLINE_RUNTIME_CHUNK=false
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine

WORKDIR /app

# Install server dependencies only
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/src/ ./server/src/

# Copy React build from stage 1
COPY --from=frontend-build /app/build ./build

# Run as non-root user for defense in depth
RUN addgroup -S app && adduser -S -G app app && chown -R app:app /app
USER app

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server/src/index.js"]
