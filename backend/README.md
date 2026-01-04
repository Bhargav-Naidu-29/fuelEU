# FuelEU Maritime Compliance Platform - Backend

## Architecture

This project follows Hexagonal Architecture (Ports & Adapters / Clean Architecture) principles.

### Dependency Direction
- `core` → `ports` → `adapters`
- Core has zero framework or infrastructure dependencies

### Structure

```
src/
  core/           # Business logic (no framework dependencies)
    domain/       # Domain entities and value objects
    application/  # Application services and use cases
    ports/        # Port interfaces (inbound and outbound)
  
  adapters/       # Framework-specific implementations
    inbound/      # Driving adapters (HTTP controllers)
      http/
    outbound/     # Driven adapters (repositories)
      postgres/
  
  infrastructure/ # Infrastructure setup
    db/           # Database configuration
    server/       # Server bootstrap
  
  shared/         # Shared utilities and types
    types/
    utils/

tests/            # Test files
```

## Setup

```bash
npm install
npm run build
npm run dev
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

