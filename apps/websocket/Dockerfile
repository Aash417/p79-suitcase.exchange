# Use Bun runtime
FROM oven/bun:1.0.26

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json bun.lock* turbo.json ./

# Copy packages directory FIRST
COPY packages ./packages

# Copy app source code
COPY apps/websocket ./apps/websocket

# Install dependencies
RUN bun install 

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

# Start the application
CMD ["sh", "-c", "cd apps/websocket && bun run prod"]
