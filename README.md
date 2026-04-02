# API Workbench

> Not documentation. An **API interaction system**.

Transform OpenAPI specifications into an interactive, intelligent interface for exploring, testing, and reasoning about APIs. APIs are treated as **living systems** — navigable, executable, and composable.

---

## Features

### Core

- **OpenAPI-first** — Load any OpenAPI 3.x spec (JSON or YAML), local file or remote URL
- **Interactive Explorer** — Navigate endpoints by tags, paths, and methods via a collapsible sidebar tree
- **Smart Search** — Fuzzy search across paths, methods, tags, and summaries with autocomplete
- **Request Builder** — Dynamic forms generated from JSON Schema, with multi-tab JSON editor (Monaco) and rendered form view
- **Syntax Highlighting** — Monaco Editor with 6 dark themes synced to your app theme
- **Request Execution** — Built-in HTTP proxy for sending requests and viewing responses
- **Response Viewer** — Syntax-highlighted JSON with status codes, timing, and headers

### UI

- **7 Themes** — Tokyo Night, Dracula, One Dark Pro, Catppuccin Mocha, Nord, Monokai, Light
- **Dark/Light Toggle** — Quick switch between dark and light modes from the header
- **Pinned Endpoints** — Pin frequently-used endpoints to the top of the sidebar (persisted)
- **Recent Endpoints** — Auto-tracked recent endpoints for quick access
- **Collapsible Sidebar** — Toggle sidebar for more workspace

### Dev Experience

- **Single Command** — `pnpm dev` starts both API server and UI dev server
- **Hot Reload** — Vite HMR for instant UI updates
- **TypeScript** — Full type safety across all packages

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Workbench                         │
├──────────────────────┬──────────────────────────────────┤
│  CLI (Fastify)       │  UI (React + Vite)               │
│                      │                                  │
│  - Parse OpenAPI     │  - Explorer sidebar              │
│  - Normalize schema  │  - Search + autocomplete         │
│  - Serve API routes  │  - Request builder (JSON/Form)   │
│  - Proxy requests    │  - Response viewer (Monaco)      │
│  - Serve static UI   │  - Theme system (7 themes)       │
└──────────────────────┴──────────────────────────────────┘
```

### Packages

| Package | Purpose |
|---|---|
| `@api-workbench/core` | Shared types and constants |
| `@api-workbench/cli` | Fastify server, OpenAPI parser, CLI commands |
| `@api-workbench/ui` | React frontend with Vite, Tailwind, Monaco Editor |

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This starts both the CLI server (port 3001) and the UI dev server (port 5173). Open http://localhost:5173.

### Production

```bash
pnpm build
node packages/cli/src/index.ts serve examples/petstore.yaml --ui-dist packages/ui/dist
```

### Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start both servers (development) |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | Type-check all packages |
| `api-workbench serve <source>` | Start server with a spec file or URL |

### Serve Options

```bash
# Local file
api-workbench serve ./petstore.yaml

# Remote URL
api-workbench serve https://petstore.swagger.io/v2/swagger.json

# Custom port
api-workbench serve ./petstore.yaml --port 8080

# With built UI
api-workbench serve ./petstore.yaml --ui-dist ./dist
```

---

## Project Structure

```
api-workbench/
├── packages/
│   ├── core/                 # Shared types
│   │   └── src/
│   │       ├── types.ts      # NormalizedEndpoint, SchemaObject, etc.
│   │       └── constants.ts  # HTTP methods, colors, storage keys
│   │
│   ├── cli/                  # Backend server
│   │   └── src/
│   │       ├── index.ts      # CLI entry (commander)
│   │       ├── commands/
│   │       │   ├── serve.ts  # Primary serve command
│   │       │   └── dev.ts    # Dev alias
│   │       └── server/
│   │           ├── index.ts  # ApiWorkbenchServer class
│   │           ├── loader.ts # Load JSON/YAML files
│   │           ├── parser.ts # Resolve $refs (swagger-parser)
│   │           ├── normalizer.ts # Build normalized model
│   │           └── routes/
│   │               ├── api.ts    # /api/spec, /api/endpoints, etc.
│   │               └── proxy.ts  # /proxy/* for HTTP requests
│   │
│   └── ui/                   # React frontend
│       └── src/
│           ├── components/
│           │   ├── Layout/
│           │   │   ├── Layout.tsx        # Main layout wrapper
│           │   │   ├── Header.tsx        # Top bar with theme + refresh
│           │   │   ├── Sidebar.tsx       # Endpoint tree with pins
│           │   │   └── ThemeSelector.tsx # Theme dropdown
│           │   ├── Search/
│           │   │   ├── SearchBar.tsx
│           │   │   ├── SearchAutocomplete.tsx
│           │   │   ├── RecentEndpoints.tsx
│           │   │   └── TopLevelPaths.tsx
│           │   ├── RequestBuilder/
│           │   │   ├── RequestBodyForm.tsx  # Multi-tab (JSON/Form)
│           │   │   ├── JsonEditor.tsx       # Monaco editor
│           │   │   ├── SchemaForm.tsx       # Schema-driven form
│           │   │   ├── FormField.tsx        # Individual field renderer
│           │   │   ├── ParameterForm.tsx    # Path/query/header params
│           │   │   └── SendButton.tsx
│           │   ├── Response/
│           │   │   ├── ResponseViewer.tsx
│           │   │   ├── JsonViewer.tsx       # Monaco response viewer
│           │   │   └── StatusBadge.tsx
│           │   └── Endpoint/
│           │       └── EndpointView.tsx
│           ├── routes/
│           │   ├── SearchLanding.tsx         # / — search landing
│           │   └── EndpointRoute.tsx         # /e/:method/*
│           ├── stores/
│           │   └── appStore.ts               # Zustand + localStorage
│           ├── themes/
│           │   └── index.ts                  # 7 theme definitions
│           └── lib/
│               ├── monacoThemes.ts           # Monaco theme registration
│               ├── theme.ts                  # Theme application
│               └── utils.ts
│
└── examples/
    └── petstore.yaml           # Sample OpenAPI spec
```

---

## Design Principles

### Respect the OpenAPI Contract

- The OpenAPI document is the **single source of truth**
- No mutation of the original schema
- All transformations are **derived, not invented**
- Full spec support: `$ref`, `oneOf`, `allOf`, `anyOf`, parameters, request bodies, responses

### Non-Destructive Abstraction

- Internal normalized model keeps traceability to original nodes
- UI evolves independently from raw spec
- Schema-driven forms generated from the contract, not hardcoded

### Hackability

- Event-driven architecture (WebSocket for spec updates)
- Plugin-ready design
- CLI-first philosophy

---

## Themes

| Theme | Type | Preview |
|---|---|---|
| Tokyo Night | Dark | `#1a1b26` `#7aa2f7` `#bb9af7` `#9ece6a` |
| Dracula | Dark | `#282a36` `#bd93f9` `#ff79c6` `#50fa7b` |
| One Dark Pro | Dark | `#282c34` `#61afef` `#c678dd` `#98c379` |
| Catppuccin Mocha | Dark | `#1e1e2e` `#89b4fa` `#f5c2e7` `#a6e3a1` |
| Nord | Dark | `#2e3440` `#81a1c1` `#88c0d0` `#a3be8c` |
| Monokai | Dark | `#272822` `#66d9ef` `#ae81ff` `#a6e22e` |
| Light | Light | `#ffffff` `#222222` `#0066cc` `#2e7d32` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| UI | Tailwind CSS + shadcn/ui patterns |
| State | Zustand + localStorage |
| Routing | React Router 6 |
| Editor | Monaco Editor |
| Backend | Fastify |
| OpenAPI | swagger-parser ($ref resolution) |
| CLI | Commander.js |
| Monorepo | pnpm workspaces |

---

## Roadmap

| Phase | Features |
|---|---|
| **Phase 1** (Done) | Load OpenAPI, render endpoints, execute requests, themes, pins, Monaco editor |
| **Phase 2** | Schema `oneOf`/`anyOf` support, request validation, advanced search |
| **Phase 3** | Request history, copy-as-curl, keyboard shortcuts, animations |
| **Phase 4** | Graph view, flow builder (chain endpoints), plugin system, AI layer |

---

## License

MIT
