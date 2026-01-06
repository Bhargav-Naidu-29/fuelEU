# Project Reflection: FuelEU Maritime Dashboard

## Scenario
The goal was to build a compliance dashboard for the **FuelEU Maritime Regulation**, requiring precise calculations (GHG intensity), secure banking of surplus, and complex fleet pooling mechanisms. The project mandated a strict **Hexagonal Architecture** (Ports & Adapters) for both Backend (Node.js) and Frontend (React), ensuring high testability and separation of concerns.

## Technical Strategy
We adopted a **Domain-First** approach:
1.  **Core Isolation**: We defined `Entities` (Route, ComplianceBalance) and `Ports` (Interfaces) before writing any infrastructure code. This allowed us to verify business logic (e.g., `ComputeComplianceBalance`) using unit tests without a database.
2.  **Strict Hexagonal Frontend**: Unlike typical React apps where components fetch data directly, we forced UI components (`RoutesTable`) to strictly use custom hooks (`useRoutes`), which in turn called Use Cases (`GetRoutes`), which then used Ports (`RoutesPort`). The API implementation (`RoutesApi`) was injected at the root.
    *   *Benefit*: We could swap the API adapter for a mock adapter during development, allowing UI work to proceed parallel to backend API development.

## Live Case Studies & Challenges

### Case 1: The "Combined" View Logic
*   **Challenge**: The user required a default "Combined" view (Year 0) for routes.
*   **Solution**: We had to align the Frontend state (`RoutesFilters`) with the Backend logic. The backend aggregated data when `year=0`. We initialized the frontend state to `0` instead of `currentYear`, triggering the correct aggregation on load.
*   **Reflection**: State initialization in React must align strictly with the "default" business case of the domain.

### Case 2: Banking Surplus Safety
*   **Challenge**: Ensuring ships only bank *positive* surplus and don't double-spend.
*   **Solution**: We implemented the check in the *Domain Layer* (`BankSurplus` use case), not the Controller. This ensures that even if a new API endpoint (e.g., GraphQL) is added, the rule holds.
*   **Reflection**: Business rules belong in Use Cases, never in Adapters (UI/Controllers).

### Case 3: UI "Clumsiness" (Padding & Layout)
*   **Challenge**: The strict architecture doesn't solve UI/UX. The initial forms looked "clumsy" with tight padding.
*   **Solution**: We applied a standardized Tailwind class set (`py-2.5 px-4`) to all inputs.
*   **Reflection**: Architecture ensures stability, but attention to detail (CSS/UX) ensures usability. The two must go hand-in-hand.

## Conclusion
The strict Hexagonal Architecture overhead was significant initially (lots of boilerplate files) but paid off during the "Refinement" phase. modifying the `CreatePool` logic to return rich data required changes *only* in the Use Case and UI, without touching the API definition or database schema.
