FROM node:18-slim

# Install system deps and cleanup
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy backend package files and install dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# Copy backend source
COPY backend/ ./

# Cloud Run expects the container to listen on the port defined by $PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

# Start the Node backend
CMD ["node", "server.js"]
