# FuelEU Maritime Backend

This is the backend service for the FuelEU Maritime compliance platform. It provides APIs for managing vessel routes, calculating compliance balances (GHz intensity), banking surpluses, and pooling compliance balances between ships.

It follows **Hexagonal Architecture (Ports & Adapters)** to enforce a strict separation between business logic and infrastructure concerns.

## 🏗 Architecture

The project is structured to isolate the core domain from external dependencies:

```
src/
├── core/                 # Pure Business Logic (No external dependencies)
│   ├── domain/           # Entities, Value Objects, Domain Errors
│   ├── application/      # Use Cases (Application specific logic)
│   └── ports/            # Interfaces (Input/Output ports)
├── adapters/             # External Interfaces (Implement Ports)
│   ├── inbound/          # Driving Adapters (HTTP Controllers)
│   └── outbound/         # Driven Adapters (Repositories, Database)
└── infrastructure/       # Configuration & Wiring
    └── server/           # App entry point, Express setup
```

### Key Principles
- **Domain-Centric**: The `core` folder contains all business rules and has *zero* dependencies on frameworks (Express, Prisma, etc.).
- **Dependency Inversion**: High-level modules (Core) define interfaces (Ports) that low-level modules (Adapters) implement.
- **Strict Boundaries**: Controllers only talk to Use Cases. Use Cases only talk to Domain Entities and Repository Interfaces.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Web Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or via Docker)

### Installation

1. **Clone the repository** (if not already done)
2. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Database Setup

1. **Environment Configuration**:
   Ensure you have a `.env` file with your database connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/fueleu_db?schema=public"
   ```

2. **Run Migrations**:
   ```bash
   npm run db:migrate
   ```

3. **Seed Database** (Optional, for initial data):
   ```bash
   npm run prisma:seed
   ```

### Running the Server

- **Development Mode** (with hot-reload):
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## 🧪 Testing

- **Run all tests**:
  ```bash
  npm test
  ```
- **Run QA Validation Script**:
  A custom QA script validates the endpoints against the specification.
  ```bash
  npx ts-node-dev -r tsconfig-paths/register qa_validation.ts
  ```

## 📚 API Reference

### 1. Routes
- `GET /routes`: List all routes.
- `POST /routes/:routeId/baseline`: Set a specific route as the baseline for a year.
- `GET /routes/comparison`: Compare a route against its baseline.

### 2. Compliance
- `GET /compliance/cb`: Calculate Compliance Balance for a ship/year.
  - Query Params: `shipId`, `year`.
- `GET /compliance/adjusted-cb`: Get Compliance Balance adjusted for banking/borrowing.

### 3. Banking (Article 20)
- `POST /banking/bank`: Bank a surplus amount for future use.
- `POST /banking/apply`: Apply a banked amount to cover a deficit.
- `GET /banking/records`: View banking transaction history.

### 4. Pooling (Article 21)
- `POST /pools`: Create a pool of ships to balance compliance.
  - Requires: `year` and a list of `members` (shipId, current CB).
  - Enforces: Total pool balance must be non-negative.
