# Crypto Trading Platform

A high-performance cryptocurrency trading platform designed for low-latency execution and seamless real-time trading. The system leverages modern frontend frameworks, a Bun-powered backend, and a modular architecture for scalability and maintainability.

## Tech Stack

- **Frontend:** Next.js (App Router, Server Actions, TanStack Query)
- **API Server:** Bun + Hono with Zod validation
- **WebSocket Server:** ws library on Bun runtime
- **Trading Engine:** In-memory orderbook & balances (modular, class-based)
- **Inter-service Communication:** Redis Queue & Pub/Sub
- **Shared Types:** Centralized TypeScript types package for strict type safety across all services

## Features

- Real-time trading with WebSocket updates
- Low-latency order execution (7-20ms average response)
- Secure API architecture with schema validation
- Scalable, decoupled service communication using Redis
- Responsive, interactive UI with dynamic code-splitting
- User asset onramping and balance management
- Live orderbook, ticker, and candlestick (Kline) visualizations
- Dynamic subscribe/unsubscribe for market data streams

## Architecture

![App Screenshot](./architecture.png)

---

## 🛰 API Workflow

The API server acts as a lightweight validation and routing layer:

1. **Validation:** Each request is validated using Zod middleware.
2. **ClientID Assignment:** A unique ClientID is generated for each request.
3. **Redis Queue:** The server enqueues the ClientID + request payload into a Redis queue.
4. **Redis Pub/Sub Subscription:** Subscribes to a Redis Pub/Sub channel identified by the ClientID.
5. **Response Handling:** Forwards the response from the channel back to the client.

This pattern minimizes computation on the API server, focusing on validation and message routing.

---

## ⚙️ Trading Engine Server

Handles all exchange business logic:

- Modular, class-based architecture with strict single-responsibility services.
- The Engine class injects all dependencies and orchestrates message routing.
- Core logic handled by Order, OrderBook, Balance, and Snapshot services.
- Error and MarketData services prepare outbound data for Redis.
- A dedicated Redis Service is the single exit point for outbound messages.

---

## 🔌 WebSocket Server (Real-Time Updates)

Enables real-time data delivery via WebSockets and Redis Pub/Sub:

- **Connection Pool:** Tracks all active client connections.
- **Client Connection:** Represents individual WebSocket sessions and manages subscriptions.
- **Channel Broker:** Manages Redis Pub/Sub subscriptions and routes published messages to clients.

**Workflow:**

- New connections are added to the Connection Pool.
- Client Connections register subscriptions via the Broker.
- The Broker listens for Redis Pub/Sub messages and dispatches updates to clients.

---

## 🖥 Frontend (Next.js Client)

The client interface is built with Next.js and optimized for performance and real-time interactivity:

- **Server-side Prefetching:** Ticker and depth data are prefetched on the server.
- **WebSocket Manager:** Manages live market data streams and dynamic subscribe/unsubscribe.
- **Strict Type Safety:** Uses a shared-types package for consistent types across frontend and backend.
- **React Query:** Handles data fetching, caching, and background updates.

### Key Features

- Place/cancel orders with real-time feedback
- Live market orderbook, ticker, and trade history
- User’s open orders and asset balances
- Kline (candlestick) and ticker visualizations
- Onramping initial assets for users
- Optimized bundle size and performance

---

## 🐳 Docker Setup

Docker is used to run a Redis instance on port 6379 for inter-service queues and Pub/Sub messaging.

```sh
docker run -d -p 6379:6379 redis
```

---

## 🛠️ Development Notes

- **Bun Native:** All backend services and scripts run on Bun for maximum performance.
- **Shared Types:** All services import types from the shared-types package for consistency.
- **TypeScript Optimization:** Type-only exports and careful type design prevent deep type instantiation issues.
- **Error Boundaries:** The frontend uses error boundaries and suspense for robust UX.
- **Performance Monitoring:** Bundle analysis and React Query Devtools are available in development.

---
