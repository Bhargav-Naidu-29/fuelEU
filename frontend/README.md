# FuelEU Maritime Frontend

A modern, hexagonal architecture React application for managing FuelEU Maritime compliance.

## Architecture

This application strictly follows **Hexagonal Architecture (Ports & Adapters)** to decouple the UI from the domain logic and infrastructure.

### Layer Structure

1.  **Core (Domain Layer)** `src/core`
    *   **Entities**: Pure TypeScript interfaces/classes defining the domain (e.g., `Route`, `Pool`, `ComplianceBalance`).
    *   **Ports**: Interfaces defining the contracts for input (Use Cases) and output (Repositories/APIs).
    *   **Use Cases**: Application logic orchestration (e.g., `CreatePool`, `CompareRoutes`). These classes rely *only* on Ports, never on concrete implementations.

2.  **Adapters (Infrastructure Layer)** `src/adapters`
    *   **Infrastructure**: Concrete implementations of Ports (e.g., `RoutesApi`, `ComplianceApi`). These fetch data via HTTP.
    *   **UI**: React components and hooks.
        *   **Hooks**: Custom hooks (e.g., `useRoutes`) act as the "Controller" in MVC terms. They instantiate Use Cases and inject the API adapters.
        *   **Components**: Presentational components that receive data via simple props.

### Directory Layout

```
src/
├── adapters/
│   ├── infrastructure/   # API Clients (Axios/Fetch wrappers)
│   └── ui/
│       ├── components/   # React Components (Banking, Pooling, Routes...)
│       ├── hooks/        # React Hooks (wiring use-cases)
│       └── layout/       # Layout containers
├── core/
│   ├── application/      # Use Cases (Business Logic)
│   ├── domain/           # Entities & Value Objects
│   └── ports/            # Interfaces (Inbound/Outbound)
└── shared/               # Shared Utilities & UI primitives
```

## Setup & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5173`.

3.  **Run Tests**:
    ```bash
    npm test
    ```

## Key Features

-   **Monitor Routes**: View, filter, and manage voyage routes. Set baselines for comparison.
-   **Comparison Tool**: Compare vessel performance against annual baselines (single ship or fleet-wide).
-   **Banking**: Manage compliance surplus (Bank/Apply) with real-time validation and adjusted balance visualization.
-   **Compliance Pooling**: Form fleet pools to offset deficits with surplus ships.

## Development Guidelines

-   **Strict Separation**: UI components must NEVER make network calls directly. They must use hooks.
-   **Hooks Responsibility**: Hooks must instantiate the Use Case and inject the dependency (API adapter).
-   **Styling**: utility-first CSS (Tailwind).
-   **Icons**: Heroicons (via SVG).

## Configuration

-   **API Endpoint**: Configured in `src/config.ts` or via environment variables (default: `http://localhost:3000`).
