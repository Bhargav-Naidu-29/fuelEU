# FuelEU Maritime Compliance Dashboard

A comprehensive, Hexagonal Architecture-based solution for managing EU maritime fuel compliance, tracking GHG intensity, handling banking/borrowing of compliance surplus, and forming fleet pools.

## Project Requirements

This project was built to satisfy the following strict requirements:

### Domain Logic
*   **GHG Intensity Calculation**: calculate compliance balance based on energy used and GHG intensity limits.
*   **Banking Mechanism**: Allow ships to bank *positive* compliance balances (`> 0`) for future years. Validation ensures no deficits are banked.
*   **Compliance Pooling**: Form pools of multiple ships. A pool is valid only if the *net* compliance balance of all members is non-negative (`>= 0`).
*   **Validation**: Strict input validation for Ship IDs, Years, and Amounts.

### Architecture & Tech Stack
*   **Architecture**: Strict **Hexagonal Architecture** (Ports & Adapters).
    *   **Core**: Domain Entities & Use Cases (Pure TypeScript, no dependencies).
    *   **Ports**: Interfaces defining Inbound (API) and Outbound (Repository) contracts.
    *   **Adapters**: Concrete implementations (Express Controllers, Prisma Repositories, React Components).
*   **Backend**: Node.js, Express, TypeScript, Prisma (PostgreSQL).
*   **Frontend**: React, TypeScript, TailwindCSS, Recharts.
*   **Tooling**: ESLint, Prettier, Jest, Supertest.

## Project Setup

### Prerequisites
*   Node.js (v18+)
*   Database (PostgreSQL)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd fuelEU
    ```

2.  **Install Dependencies**:
    ```bash
    # Install root dependencies
    npm install
    
    # Install Backend dependencies
    cd backend
    npm install
    
    # Install Frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Database Setup**:
    Ensure your PostgreSQL database is running and update the `.env` file in `backend/` with your connection string.
    ```bash
    cd backend
    npx prisma migrate dev --name init
    npx prisma db seed # (Optional) Seed with sample routes
    ```

4.  **Run Development Servers**:
    Open two terminals:

    *Terminal 1 (Backend)*:
    ```bash
    cd backend
    npm run dev
    ```

    *Terminal 2 (Frontend)*:
    ```bash
    cd frontend
    npm run dev
    ```

5.  **Access the Application**:
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Screenshots & Features

### 1. Monitor Routes (Combined View)
*View aggregated performance across all years along with individual voyage details. Default view shows all routes.*
![Monitor Routes](file:///C:/Users/palav/.gemini/antigravity/brain/4dcc6bbc-80d5-497d-8492-14f68a2b3cfd/monitor_routes_combined_updated_1767711027520.png)

### 2. Banking Compliance Surplus
*Manage compliance credit banking with a secure, regulated interface. Features validated inputs.*
![Banking Interface](file:///C:/Users/palav/.gemini/antigravity/brain/4dcc6bbc-80d5-497d-8492-14f68a2b3cfd/banking_tab_1767710914868.png)

### 3. Fleet Pooling
*Form compliance pools and visualize the contribution of each vessel. Real-time validation of pool health.*
![Pooling Interface](file:///C:/Users/palav/.gemini/antigravity/brain/4dcc6bbc-80d5-497d-8492-14f68a2b3cfd/pooling_tab_1767710926305.png)

### 4. Compliance Comparison
*Decision support tool for annual compliance planning. Compare Ship Performance vs Baseline.*
![Comparison Tool](file:///C:/Users/palav/.gemini/antigravity/brain/4dcc6bbc-80d5-497d-8492-14f68a2b3cfd/compare_tab_1767710937572.png)