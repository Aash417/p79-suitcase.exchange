FROM oven/bun:1.0.26

WORKDIR /app

# Copy package.json and bun.lock files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Command to run the application
CMD ["bun", "run", "prod"]
