# FuelEU Maritime Compliance Dashboard

A comprehensive decision-support tool for shipping companies to manage GHG intensity compliance under the FuelEU Maritime regulation.

## Core Features

- **Route Monitoring**: Real-time tracking of vessel routes and GHG intensity performance.
- **Comparison Tool**: Side-by-side analysis of routes against baseline performance to verify compliance.
- **Banking System**: Strategic management of compliance surplus, allowing for "banking" of excess compliance for future years or application to current deficits.
- **Compliance Pooling**: Collaborative pooling of multiple vessels to achieve shared compliance targets.
- **Professional Analytics**: High-quality data visualization using Recharts for performance trends and contribution analysis.

## Technical Architecture

The project follows a strict **Hexagonal Architecture** (Ports and Adapters) on both Backend and Frontend to ensure:
- Decoupling of domain logic from infrastructure (Database, HTTP, UI).
- Testability of core compliance calculations.
- Maintainability and clear separation of concerns.

### Tech Stack
-   **Frontend**: React, TypeScript, TailwindCSS, Recharts.
-   **Backend**: Node.js, TypeScript, Express, Prisma ORM, PostgreSQL (containerized).

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (for database)

### Backend Setup
1. `cd backend`
2. `npm install`
3. `docker-compose up -d`
4. `npx prisma migrate dev`
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## API Documentation (Sample Requests)

### Monitoring
`GET /routes` - Fetch all vessel routes.
`POST /routes/:routeId/baseline` - Set a specific route as the performance baseline.

### Banking
`POST /banking/bank`
```json
{
  "shipId": "SHIP-123",
  "year": 2025,
  "amount": 50000
}
```

### Pooling
`POST /pooling/pools`
```json
{
  "year": 2025,
  "members": [
    { "shipId": "SHIP-A", "cb": 5000 },
    { "shipId": "SHIP-B", "cb": -2000 }
  ]
}
```

---
*Developed with Anti-Gravity AI*