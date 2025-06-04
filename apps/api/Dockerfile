# Use Bun runtime
FROM oven/bun:1.0.26

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json bun.lock* ./
COPY turbo.json ./

# Copy package.json files for dependency resolution
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Install dependencies
RUN bun install 

# Copy source code
COPY apps/api/ ./apps/api/

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

# Start the application
CMD ["sh", "-c", "cd apps/api && bun run prod"]
