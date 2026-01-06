# AI Agent Workflow Log: FuelEU Maritime Backend

This document records the intentional and auditable use of AI agents during the development of the **FuelEU Maritime Backend**. All domain logic, regulatory compliance formulas, and architectural decisions were implemented or verified manually to ensure engineering integrity.

---

## 1. AI Agent Overview

The following tools were used under a "Human-in-the-loop" model, where AI handled boilerplate while developers handled core logic.

| Agent | Primary Purpose | Scope of Usage |
| :--- | :--- | :--- |
| **Cursor Agent** | Structural & Boilerplate | Scaffolding, repository adapters, controller wiring, and test generation. |
| **GitHub Copilot** | Inline Assistance | Repetitive mappings, imports, constructors, and syntax completion. |
| **Anti-Gravity AI** | Validation | Strict black-box API testing and endpoint verification (no code changes). |

> [!IMPORTANT]
> **No AI agent was used to generate or decide FuelEU compliance formulas, banking rules, or pooling logic.** All regulatory math was implemented manually.

---

## 2. Documented Prompts & Outputs

### 2.1 Backend Scaffolding (Architectural Setup)
**Prompt:**
> Generate a backend project skeleton using Node.js + TypeScript following Hexagonal Architecture. 
> **Constraints:** > - core → ports → adapters → infrastructure 
> - No frameworks in core 
> - Express and Prisma only in adapters/infrastructure 
> - Do NOT implement business logic. Backend only.

**Output & Action:**
* **Result:** Created a clean hexagonal folder structure (`core/domain`, `core/application`, `core/ports`, etc.) with empty placeholders.
* **Action Taken:** Structure accepted. All domain entities and use cases were implemented manually afterward.

### 2.2 Repository Adapter Generation (Data Persistence)
**Prompt:**
> Create a Prisma repository adapter implementing `BankingRepository`. 
> **Constraints:** > - Only persistence logic; no business logic.
> - Follow existing interface. 
> - File path: `src/adapters/outbound/postgres/repositories/PrismaBankingRepository.ts`

**Output & Corrections:**
* **Result:** Generated a Prisma adapter with `save`, `findTotalBankedForShip`, and `applyBankedAmount`.
* **Corrections Applied:** Fixed type mismatches (specifically `Year` vs `number`), ensured `camelCase` consistency, and verified that no domain rules leaked into the persistence layer.

> This workflow ensures transparency, correctness, and professional engineering judgment aligned with real-world production standards.

---

## Frontend — AI Agent Usage

### Agents Used

- **Anti-Gravity AI**
  - Used for scaffolding the directory structure and implementing shared UI primitives (`Button`, `Table`, `Loader`) and pure utility functions (`formatNumber`, `formatPercentage`).
  - **No business or domain logic** was generated; all components and utilities are presentational and generic.
  - All code was manually reviewed to ensure zero coupling with core domain logic.

---

## 3. Validation, Corrections & Logic Control

To maintain "Intellectual Honesty" and project accuracy, all AI-generated outputs underwent rigorous manual review:

* **Architecture Guardrails:** Verified that no framework-specific imports (Express/Prisma) leaked into the `core` layer.
* **Formula Verification:** All Compliance Balance (CB) calculations were cross-checked manually against official FuelEU Maritime formulas.
* **Manual Refactoring:** * Corrected AI-suggested HTTP status codes (changing generic `500` errors to specific `400` or `409` conflicts).
    * Rejected AI suggestions to pass compliance inputs via `GET` query strings.
    * Reworked `GET /compliance/cb` to ensure it computes data strictly from persisted route records.

---

## 4. Engineering Observations

### Where AI Enhanced Productivity
* Rapid generation of Hexagonal boilerplate.
* Automated creation of Unit Test shells for Value Objects.
* Reducing friction in Prisma schema-to-repository mapping.

### Where AI Failed (Human Intervention Required)
* **Regulatory Context:** AI failed to realize that CB must be derived from stored route data rather than user-provided inputs in a `GET` request.
* **Logic Leakage:** AI occasionally attempted to place business rules inside Controller layers.
* **Type Safety:** Occasional hallucinations regarding custom Domain Types vs. TypeScript primitive types.

---

## 5. Best Practices & Compliance

* **Auditability:** AI was treated as an assistant, not an authority. Every line of code is justifiable to a human reviewer.
* **Domain Integrity:** All FuelEU math, banking invariants, and pooling logic remain 100% human-written.
* **Process:** Incremental Git commits were maintained to track the evolution of the codebase from AI-scaffolded structures to logic-complete features.

---
**Document Status:** Final | **Project:** FuelEU Maritime Backend
