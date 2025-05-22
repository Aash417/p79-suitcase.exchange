FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json bun.lock* ./
COPY turbo.json ./

# Copy package.json files for dependency resolution
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN npm install -g bun
RUN bun install

# Copy source code
COPY apps/web/ ./apps/web/
COPY packages/ ./packages/

# Build the Next.js application
WORKDIR /app/apps/web
ENV NODE_ENV=production
RUN bun run build
WORKDIR /app

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Install minimal runtime dependencies
RUN apk add --no-cache curl

# Copy built application from builder stage
COPY --from=builder /app/apps/web/.next /app/.next
COPY --from=builder /app/apps/web/public /app/public
COPY --from=builder /app/apps/web/package.json /app/package.json
COPY --from=builder /app/apps/web/next.config.js /app/next.config.js

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Set proper environment variables for Next.js
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Start the application
CMD ["npx", "next", "start"]
