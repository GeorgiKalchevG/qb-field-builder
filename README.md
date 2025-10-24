# qb-field-builder

A React + TypeScript application for creating and managing selectable “fields” (option lists) with a simple UI. It includes a demo mock API, form-building components, and tests powered by Vitest and Testing Library.

This README documents the stack, requirements, setup, available scripts, environment variables (if any), how to run tests, project structure, and license status. Unknowns are called out as TODOs.

## Overview

- Purpose: Build and manage sets of selectable choices ("fields").
- Key UI modules:
  - FieldBuilder: create/update a field by label, default value, choices, and options like displayAlpha/required.
  - Fields: list existing fields and select one to edit.
  - Button, SubmitButton, TitledContainer, inputs (TextField, CustomTextarea), and error messaging.
- Data layer:
  - TanStack Query for fetching/mutating field data.
  - A local json-server mock API with a sample db.json is included for development.

## Tech stack

- Language: TypeScript
- Runtime: Node.js
- Framework: React 19
- Build tool: Vite 7
- State/data: @tanstack/react-query
- Forms: react-hook-form
- Styling: SCSS modules (sass-embedded)
- Testing: Vitest + @testing-library/react + jsdom
- Linting: ESLint (flat config)

## Requirements

- Node.js 18+ (recommended LTS) – required by Vite 7 and the toolchain
- npm (project uses npm; package-lock.json is present)

## Getting started

1. Install dependencies
   - npm install
2. Start the development server
   - npm run dev
   - Vite dev server runs and serves index.html (entry: src/main.tsx)
   - Script uses --host so it’s accessible on your LAN as well as localhost.
3. (Optional) Start the mock API server in another terminal
   - npm run mockServer
   - This launches json-server against mockServer/db.json (defaults to http://localhost:3000)
   - Example endpoint: GET http://localhost:3000/fields

## Scripts

- npm run dev
  - Start Vite dev server with HMR.
- npm run build
  - Type-check/build TypeScript (tsc -b) and bundle the app with Vite.
- npm run preview
  - Serve the production build locally for preview.
- npm run lint
  - Run ESLint across the project.
- npm run test
  - Run unit/integration tests with Vitest (jsdom environment).
- npm run test-coverage
  - Run test suite with coverage reporting (v8). Note: script name contains a typo; see TODO below.
- npm run mockServer
  - Start json-server on the mock database (mockServer/db.json).

## Entry points

- HTML entry: index.html
- App entry: src/main.tsx (renders <App /> into #root)
- Vite config: vite.config.ts

## Environment variables

- No environment variables are currently referenced in the codebase.
- TODO: Document any API base URLs or feature flags if/when they are introduced (e.g., via import.meta.env.VITE_* variables).

## Running tests

- Run tests: npm test
- Run with coverage: npm run test-covarage
- Test environment: jsdom (configured in vite.config.ts)
- Custom test setup: src/tests/setup.ts (Testing Library helpers, cleanup, userEvent)

## Project structure (partial)

- index.html
- vite.config.ts
- tsconfig*.json
- eslint.config.js
- mockServer/
  - db.json
- src/
  - main.tsx
  - App.tsx
  - index.css
  - api/
  - components/
    - Button/
    - ErrorMessage/
    - FieldBuilder/
    - Fields/
    - Inputs/
    - TitledContainer/
  - hooks/
  - tests/
    - setup.ts

## Development notes

- Styles use CSS Modules via SCSS; ensure sass-embedded is installed (dev dependency is present).
- React Query’s QueryClient is provided in src/main.tsx.
- Error boundary is configured via react-error-boundary in src/main.tsx.

## Known TODOs

- Fix scripts naming: consider adding an alias npm run test-coverage to avoid the current test-covarage typo (or rename if acceptable).
- Environment variables: if a real API is added, introduce and document VITE_API_BASE_URL (or similar) and usage.
- Deployment: add deployment instructions once a target environment is defined.
- README visuals: consider adding screenshots or GIFs to illustrate the field builder UI.

