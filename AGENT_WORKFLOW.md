```markdown
# AI Agent Workflow Log

This document records how AI agents were used during the development of the **FuelEU Maritime Backend**, in accordance with the assignment requirements.  
AI usage was **intentional, constrained, and auditable**, with all **domain logic implemented manually**.

---

## Backend — AI Agent Usage

### Agents Used

- **Cursor Agent**
  - Used for backend scaffolding, repository adapters, controller wiring, and test generation
- **GitHub Copilot**
  - Used for inline boilerplate assistance (imports, constructors, repetitive mappings)
- **Anti-Gravity AI**
  - Used strictly for black-box API testing and validation (no code changes)

> ❗ No AI agent was used to generate or decide **FuelEU compliance formulas**, **banking rules**, or **pooling logic**.

---

## Prompts & Outputs

### Example 1 — Backend Scaffolding (Allowed Use)

**Prompt:**

```

Generate a backend project skeleton using Node.js + TypeScript following Hexagonal Architecture.
Constraints:

* core → ports → adapters → infrastructure
* No frameworks in core
* Express and Prisma only in adapters/infrastructure
* Do NOT implement business logic
  Backend only.

```

**Output:**
- Created hexagonal folder structure:
  - `core/domain`
  - `core/application`
  - `core/ports`
  - `adapters/inbound/http`
  - `adapters/outbound/postgres`
  - `infrastructure/server`
- Empty placeholders without business logic

**Action Taken:**
- Structure accepted
- All domain entities and use cases implemented manually afterward

---

### Example 2 — Repository Adapter Generation (Allowed Use)

**Prompt:**

```

Create a Prisma repository adapter implementing BankingRepository.
Constraints:

* Only persistence logic
* No business logic
* Follow existing interface
* File path: src/adapters/outbound/postgres/repositories/PrismaBankingRepository.ts

```

**Output:**
- Prisma adapter with methods:
  - `save`
  - `findTotalBankedForShip`
  - `applyBankedAmount`
- Correct use of Prisma client

**Corrections Applied:**
- Fixed type mismatch (`Year` vs `number`)
- Ensured camelCase consistency
- Verified no domain rules were introduced

---

## Validation / Corrections

All AI-generated output was manually reviewed and validated:

- **Architecture validation**
  - Ensured no imports from `core` into framework layers
  - Verified dependency direction: core → ports → adapters

- **Manual logic verification**
  - Compliance Balance calculations verified against FuelEU formulas
  - Banking and pooling invariants checked manually

- **Black-box API testing**
  - Anti-Gravity AI used to test endpoints without modifying code
  - Responses compared directly with project specification

- **Manual corrections**
  - Fixed incorrect HTTP status codes (500 → 400 / 409)
  - Removed invalid GET designs that accepted raw compliance inputs
  - Reworked GET `/compliance/cb` to compute from persisted route data only

---

## Observations

### Where AI Saved Time
- Project scaffolding
- Prisma adapter boilerplate
- Controller wiring
- Unit test generation for value objects and use cases

### Where AI Failed or Hallucinated
- Suggested passing compliance inputs via GET queries (rejected)
- Missed regulatory constraint that CB must be derived from stored routes
- Occasionally suggested controller-level logic (manually corrected)

### How Tools Were Combined Effectively
- **Cursor Agent** → structural generation and safe refactors
- **Copilot** → inline boilerplate assistance
- **Anti-Gravity AI** → endpoint testing and validation reports
- **Manual coding** → all domain logic, compliance math, and rule enforcement

---

## Best Practices Followed

- AI used **only where justifiable to an interviewer**
- AI never used for:
  - FuelEU compliance math
  - Banking or pooling rules
  - Domain decision-making
- Strict Hexagonal Architecture enforced
- All AI outputs manually reviewed
- Incremental Git commits maintained
- AI treated as an **assistant**, not an **authority**

---

> This workflow ensures transparency, correctness, and professional engineering judgment aligned with real-world production standards.
```
