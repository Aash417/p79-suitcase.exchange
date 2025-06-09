# Use Bun runtime
FROM oven/bun:1.0.26

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json bun.lock* turbo.json ./

# Copy packages directory FIRST
COPY packages ./packages

# Copy app source code
COPY apps/engine ./apps/engine

# Install dependencies
RUN bun install 

# Create data directory
# RUN mkdir -p /app/data

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

# Start the application
CMD ["sh", "-c", "cd apps/engine && bun run prod"]
