# Use Bun runtime
FROM oven/bun:1.0.26

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json bun.lock* ./
COPY turbo.json ./

# Copy package.json files for dependency resolution
COPY apps/websocket/package.json ./apps/websocket/
COPY packages/ ./packages/

# Install dependencies
RUN bun install 

# Copy source code
COPY apps/websocket/ ./apps/websocket/

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

# Start the application
CMD ["sh", "-c", "cd apps/websocket && bun run prod"]
