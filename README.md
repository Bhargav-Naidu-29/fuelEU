# FuelEU Maritime Compliance Dashboard

A comprehensive, Hexagonal Architecture-based solution for managing EU maritime fuel compliance, tracking GHG intensity, handling banking/borrowing of compliance surplus, and forming fleet pools.

## Overview

This application helps shipping companies:
*   **Monitor Routes**: Track actual vs. baseline GHG intensity for voyages.
*   **Compare Performance**: Visualize compliance status against annual targets.
*   **Bank Surplus**: Securely bank over-compliance balances for future use.
*   **Pool Compliance**: Aggregate fleet performance to offset non-compliant ships with surplus ones.

## Screenshots

### 1. Monitor Routes (Combined View)
*View aggregated performance across all years along with individual voyage details.*
![Monitor Routes](file:///C:/Users/palav/.gemini/antigravity/brain/4dcc6bbc-80d5-497d-8492-14f68a2b3cfd/monitor_routes_combined_updated_1767711027520.png)

### 2. Banking Compliance Surplus
*Manage compliance credit banking with a secure, regulated interface.*
![Banking Interface](file:///C:/Users/palav/.gemini/antigravity/brain/4dcc6bbc-80d5-497d-8492-14f68a2b3cfd/banking_tab_1767710914868.png)

### 3. Fleet Pooling
*Form compliance pools and visualize the contribution of each vessel.*
![Pooling Interface](file:///C:/Users/palav/.gemini/antigravity/brain/4dcc6bbc-80d5-497d-8492-14f68a2b3cfd/pooling_tab_1767710926305.png)

### 4. Compliance Comparison
*Decision support tool for annual compliance planning.*
![Comparison Tool](file:///C:/Users/palav/.gemini/antigravity/brain/4dcc6bbc-80d5-497d-8492-14f68a2b3cfd/compare_tab_1767710937572.png)

## Architecture

This project strictly adheres to **Hexagonal Architecture** (Ports & Adapters) to ensure maintainability and testability.

### Backend (Node.js)
*   **Core**: Contains `Entities` (Route, Pool) and `Ports` (Repository Interfaces).
*   **Application**: Contains `Use Cases` (e.g., `ComputeCompliance`, `CreatePool`) containing pure business logic.
*   **Adapters**: `Express` controllers and `Prisma` repositories.

### Frontend (React)
*   **Core**: Domain entities and Port definitions.
*   **Adapters (UI)**: React components (`RoutesTable`) and Hooks (`useRoutes`).
*   **Adapters (Infra)**: Axios-based API clients implementing the Ports.

## Getting Started

1.  **Clone the repository**.
2.  **Install dependencies**: `npm install` (root, frontend, backend).
3.  **Run Development Servers**:
    ```bash
    # Terminal 1 (Backend)
    cd backend && npm run dev
    # Terminal 2 (Frontend)
    cd frontend && npm run dev
    ```
4.  **Access App**: `http://localhost:5173`