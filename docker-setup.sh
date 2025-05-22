#!/bin/sh

echo "🚀 Setting up Docker environment for bun-turbo..."

# Build the images
echo "📦 Building Docker images..."
bun run docker:build

# Start the services
echo "🔥 Starting services..."
bun run docker:up

# Show the logs
echo "📋 Services are starting. Here are the logs:"
bun run docker:logs

# Note: Press Ctrl+C to stop viewing logs, services will continue running in background
