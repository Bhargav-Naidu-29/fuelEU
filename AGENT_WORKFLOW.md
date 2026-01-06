# Agent Workflow Documentation

This document records the workflows, prompts, and agentic interactions used to build the FuelEU Maritime Dashboard.

## Phase 1: Backend Development (Hexagonal Architecture)

*Note: These prompts were executed by a foundational agentic AI to establish the core domain logic and API structure.*

### Prompt 1: Project Scaffolding & Hexagonal Architecture
> "Create a new Node.js TypeScript project for FuelEU Maritime compliance. Implement a strict Hexagonal Architecture with the following folder structure: `src/core/domain`, `src/core/ports`, `src/core/application`, `src/adapters/inbound`, `src/adapters/outbound`. Initialize a basic Express server in `src/adapters/inbound/http/server.ts`."

**Outcome**: Established the clean architecture separation.

### Prompt 2: Domain Modeling (Routes & Compliance)
> "Define the domain entities for `Route` and `ComplianceBalance` in `src/core/domain/entities`. A Route should have `id`, `startPort`, `endPort`, `realCb`, and `baselineCb`. A ComplianceBalance should track the surplus/deficit. Ensure these are pure TypeScript classes/interfaces with no external dependencies."

**Outcome**: Core business entities created.

### Prompt 3: Compliance Logic Implementation
> "Implement a Use Case `ComputeComplianceBalance` in `src/core/application/use-cases`. It should accept a `shipId` and `year`, fetch routes via a `RoutesPort`, and calculate the total compliance balance based on the difference between `baselineCb` and `realCb`. Write unit tests for this logic using Jest."

**Outcome**: Business logic for penalty/surplus calculation verified.

### Prompt 4: Banking System Logic
> "Implement the Banking Mechanism. Create a `BankSurplus` use case that allows a ship to bank its positive compliance balance for future years. Add validation to ensure only positive balances can be banked. Store these records via a `BankingPort`. Handle domain errors like `InsufficientSurplus`."

**Outcome**: Future-proofing compliance logic added.

### Prompt 5: Compliance Pooling Logic
> "Create a `CreatePool` use case. It should accept a list of ships and a year. It must verify that the sum of their compliance balances is non-negative. If valid, return a success result; otherwise, throw a `PoolComplianceError`. Implement the necessary `PoolingPort` interface."

**Outcome**: Fleet-wide compliance pooling logic implemented.

### Prompt 6: API Layer & Error Mapping
> "Map the domain errors to HTTP status codes. `InvalidComplianceValueError` should return 400, and `InsufficientSurplus` should return 409. create `RoutesController`, `ComplianceController`, and `BankingController` to expose the use cases via REST endpoints."

**Outcome**: HTTP adapters wired to domain logic.

---

## Phase 2: Frontend Development (Modern React + Hexagonal)

*Prompts executed by Antigravity Agent to build the UI and integrate with the Backend.*

### Prompt 7: Frontend Scaffolding & Layout
> "Initialize a Vite + React + TypeScript frontend. Setup TailwindCSS for styling. Create a main layout with a sidebar navigation for 'Monitor Routes', 'Compare', 'Banking', and 'Pooling'. Use a Hexagonal Architecture folder structure: `adapters/ui`, `adapters/infrastructure`, `core/application`."

**Outcome**: Frontend base created with matching architecture.

### Prompt 8: Routes & Baseline Management
> "Implement the 'Monitor Routes' tab. Create a `RoutesTable` component to display fetched routes. Add a filter bar for Year and Vessel Type. Implement the `GetRoutes` use case and `RoutesApi` adapter to fetch data from `GET /routes`."

**Outcome**: Data visualization for voyage routes.

### Prompt 9: Comparison Tool
> "Build a Comparison Tool in the 'Compare' tab. Allow users to select a Ship ID and Year to compare their performance against the baseline. Display the result in a `CompareTable` with columns for Real CB vs. Baseline CB and a Status badge (Compliant/Non-Compliant)."

**Outcome**: Decision support tool for compliance.

### Prompt 10: Banking UI & Integration
> "Develop the Banking tab. Create two forms: `BankForm` to bank surplus and `ApplyBankForm` to apply it. Display a `BankingSummary` card showing the current balance. Wire these forms to `POST /compliance/bank` and `POST /compliance/apply` endpoints."

**Outcome**: Full banking lifecycle management UI.

### Prompt 11: Pooling UI & Visualization
> "Implement the Pooling tab. Create a `CreatePoolForm` that allows adding multiple ships to a pool. Display a generic success message. Use Recharts to show a Pie Chart of the pool's composition (Contribution vs. Deficit)."

**Outcome**: Complex fleet management interface.

---

## Phase 3: Refinement & Polish

### Prompt 12: UI Refinements (Banking & Routes)
> "Refine the UI:
> 1. Center the Banking forms and darken the dropdown background in `ApplyBankForm`.
> 2. Remove 'All Years' option in Banking Summary.
> 3. Set 'Monitor Routes' default filter to 'Combined' (0).
> 4. Fix input padding in all forms to be less clumsy (`py-2.5 px-4`)."

**Outcome**: polished, professional UI.

### Prompt 13: Pooling Enhancements
> "Improve `CreatePoolForm`: Instead of a simple success message, show a detailed result card with the total pool balance and individual member contributions after creation. Fix the Pie Chart spacing."

**Outcome**: Enhanced user feedback loop.

### Prompt 14: Documentation & Finalization
> "Write comprehensive documentation. Create `frontend/README.md` explaining the architecture. Update `REFLECTION.md` with lessons learned. Run the app and capture screenshots for the main README."

**Outcome**: Full project documentation delivery.
