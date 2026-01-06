# AI Agent Workflow Log

## Agents Used
*   **Foundational Agent (Claude/ChatGPT)**: Used for initial Backend scaffolding, domain modeling, and tooling setup.
*   **Antigravity Agent (Gemini)**: Used for Frontend development, backend API adapters, UI refinements, bug fixing, and documentation.

## Prompts & Outputs

### 1. Backend Tooling Setup (Foundational Agent)
**Prompt**:
> Context:
> This is the backend of a FuelEU Maritime compliance platform.
> The project already has a basic Node.js + TypeScript setup.
>
> Your task:
> Update the backend project to include all required development tooling and plugins explicitly expected by the assignment, without adding any business logic.
>
> Hard constraints:
> - Do NOT implement domain logic, formulas, or API logic
> - Do NOT change the existing hexagonal folder structure
> - Do NOT introduce framework usage into the core layer
> - Only add dependencies, devDependencies, and config files
>
> Tooling that MUST be added:
> - ESLint (TypeScript-aware)
> - Prettier
> - ESLint–Prettier integration
> - Unit testing setup (TypeScript-compatible)
> - HTTP integration testing support
> - PostgreSQL connectivity tooling (driver or ORM + migration support)
>
> Allowed actions:
> - Update package.json
> - Add configuration files (ESLint, Prettier, test config)
> - Add npm scripts for linting, formatting, and testing
>
> Not allowed:
> - Writing application logic
> - Writing database queries
> - Writing endpoint handlers
> - Adding validation rules or business constraints
>
> Goal:
> Ensure the backend meets the assignment’s code quality, testing, and infrastructure readiness requirements while keeping the domain layer untouched.
>
> Stop once tooling setup is complete.

**Output (Snippet)**:
Updated `package.json` with `eslint`, `prettier`, `jest`, `supertest`, `prisma` dependencies and created `.eslintrc.js`, `jest.config.js`.

### 2. Backend Persistence Adapter (Foundational Agent)
**Prompt**:
> Context:
> This project follows Hexagonal / Clean Architecture with strict dependency rules:
> core → ports → adapters → infrastructure.
>
> You are implementing ONLY the outbound persistence adapter for ComplianceBalance using Prisma.
>
> Hard constraints (must follow strictly):
> - Do NOT modify any files inside src/core
> - Do NOT add business logic or compliance calculations
> - Do NOT import Prisma into core or ports
> - Only implement repository wiring and persistence mapping
>
> Target interface (already exists):
> `src/core/ports/outbound/ComplianceRepository.ts`
> The adapter must implement this interface.
>
> Files to CREATE or MODIFY (no others):
> - Create `src/adapters/outbound/postgres/repositories/PrismaComplianceRepository.ts`
> - Modify (export barrel if needed) `src/adapters/outbound/postgres/repositories/index.ts`
>
> Database access rules:
> - Use Prisma client from: `src/infrastructure/db/prisma.ts`
> - Assume a Prisma model exists for ship_compliance
> - Perform simple CRUD mapping only
>
> Mapping rules:
> - Convert Prisma records → ComplianceBalance domain entity
> - Convert ComplianceBalance → Prisma input
> - Handle Year value object correctly
>
> Not allowed:
> - Validation logic
> - HTTP logic
> - Use case logic
> - Banking or pooling logic
> - Try/catch swallowing domain errors
>
> Goal:
> Implement a clean, minimal outbound adapter that persists and retrieves ComplianceBalance while keeping the domain completely infrastructure-agnostic.
>
> Stop once the repository adapter is complete.

**Output (Snippet)**:
Created `PrismaComplianceRepository` class implementing `ComplianceRepository`, with clean mapping methods between Prisma types and Domain types.

### 3. Frontend Development & Refinement (Antigravity Agent)
**Prompt**:
> **UI Refinements Task**:
> 1. Add some padding to the input field elements now there is no padding the UI looks clumsy so add some padding to the every input element according to their sizes.
> 2. at the monitor route tab although the default dropdown option is combined but no routes are displayed defaultly when i select another option and then again select combined option then all routes are displayed, so make sure that at default when refreshed aslo t=all the routes should be dispalyed for the combined option
> 3. update the agent_workflow readme.md...
> 4. also upadate the reflection.md file...
> 5. after doing all these changes and updates run the entire application and update the /fuelEU/readme.md by attaching all the images...

**Output (Snippet)**:
- Modified `RoutesFilters.tsx` to handle `initialYear` logic, ensuring default `0` (Combined) works on load.
- Applied `py-2.5 px-4` class to inputs in `BankForm`, `ApplyBankForm`, and `CreatePoolForm`.
- Generated detailed verify/screenshot plan.

## Validation / Corrections

### Backend Verification
*   **Tooling**: Verified `npm run lint` and `npm test` execute successfully.
*   **Architecture**: Manually checked imports in `src/core` to ensure no `prisma` or `express` imports leaked in.
*   **Correction**: The initial Prompt 2 output had a minor type mismatch in the Prisma `where` clause for `year`. I corrected it by ensuring the `year` value object was unwrapped to a primitive number before passing to Prisma.

### Frontend Verification
*   **Padding**: Visually verified the padding changes using screenshots (`banking_tab.png`). The inputs looked much less "clumsy" and aligned well with buttons.
*   **Routes Filter**:
    *   *Issue*: Initial agent output used `initialYear || currentYear`, which ignored `0` (Combined).
    *   *Correction**: I modified the hook to `initialYear !== undefined ? initialYear : 0`, explicitly handling the falsy `0` value.
    *   *Validation*: Ran a browser session to load the page, check row count (5), filter by 2026 (0 rows), and switch back to Combined (5 rows).

## Observations
*   **Time Savings**: The Foundational Agent saved approx. 2 hours of boilerplate setup for ESLint/Jest and the Prisma Adapter structure. I simply had to review the generated code rather than write it from scratch.
*   **Hallucinations/Failures**:
    *   The agent occasionally struggled with the specific Hexagonal path aliases (e.g., trying to import from `@core/` when the tsconfig alias was `@/core`). I had to manually fix the import paths.
    *   React state initialization for "Combined" views (value `0`) is a common "off-by-one" or "falsy" logic error that the agent missed initially.
*   **Tool Combination**: Using the `browser_subagent` to take screenshots and verify the table state was highly effective. It provided proof of fix without needing me to manually click through the UI.

## Best Practices Followed
*   **Strict Context Control**: Each prompt (especially the backend ones) included "Hard constraints" and "Not allowed" sections. This prevented the agent from over-engineering or violating architecture rules.
*   **Incremental Verification**: We didn't try to generate the whole app at once. We did Tooling -> Backend Core -> Adapters -> Frontend -> Polish.
*   **Automated visual testing**: Using the browser tool to capture screenshots after every major UI change to ensure no regression in layout.
