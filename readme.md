

# Crypto Trading Platform

## Project Overview
A high-performance cryptocurrency trading platform built for low-latency execution and seamless real-time trading. It combines modern frontend frameworks with optimized backend services for an efficient trading experience.

## Tech Stack

* **Frontend:** Next.js (Server Actions + TanStack Query)
* **API Server:** Bun + Hono with Zod validation
* **WebSocket Server:** ws library on Bun runtime
* **Trading Engine:** In-memory orderbook & balances
* **Inter-service Communication:** Redis Queue & Pub/Sub

## Features

* Real-time trading with WebSocket updates
* Low-latency order execution (7-20ms average response)
* Secure API architecture with schema validation
* Scalable service communication using Redis
* Responsive, interactive UI built with Next.js

## Architecture  
![App Screenshot](./architecture.png)
