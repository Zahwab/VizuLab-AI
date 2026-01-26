# VizuLab AI Developer Guide

This guide is intended for developers who want to contribute to VizuLab AI or understand its codebase.

## 1. Project Setup

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/vizulab-ai.git
    cd vizulab-ai
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the dev server:
    ```bash
    npm run dev
    ```

## 2. Architecture Overview

VizuLab AI is a React-based Single Page Application (SPA). It leverages `Puter.js` to interface with the Gemini Flash LLM.

### Component Map

```mermaid
graph TD
    App[App.tsx] --> Layout[Layout Component]
    Layout --> Chat[ChatInterface.tsx]
    Layout --> Sim[SimulationViewer.tsx]
    Chat --> LLM[src/lib/llm.ts]
    Sim --> Iframe[Sandbox Iframe]

    subgraph Services
        LLM -.-> Puter[Puter.js SDK]
    end
```

### Key Directories

*   **`src/components`**: UI components (Chat, SimulationViewer, etc.).
*   **`src/lib`**: Logic and helper functions.
    *   `llm.ts`: The core logic for interacting with the AI model.
*   **`src/types`**: TypeScript type definitions.

## 3. Core Logic Explanation

### AI Integration (`src/lib/llm.ts`)
The application does not use a traditional backend. Instead, it uses `puter.ai.chat` to directly communicate with the LLM from the client side.

**Flow:**
1.  User prompt is received.
2.  System prompt is prepended (defining the persona and output format).
3.  Request sent to `puter.ai.chat`.
4.  Response is parsed. It *must* return a valid HTML string containing the simulation code.

### Sandboxing
Security is critical. The generated code is rendered inside an `iframe` with the `sandbox` attribute set to `allow-scripts allow-same-origin`. This prevents the generated code from accessing cookies or local storage of the parent app, while still allowing it to run JavaScript.

## 4. Development Workflow

### Adding a New Feature
1.  Create a branch.
2.  Implement your changes.
3.  Ensure linting passes:
    ```bash
    npm run lint
    ```
4.  Submit a Pull Request.

### modifying the System Prompt
If you need to change how the AI generates code (e.g., to support a new library), modify the system prompt constant in `src/lib/llm.ts`.

## 5. Build for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

---
*Happy Coding!*
