# Design Document: VizuLab AI

## 1. Architecture Overview
The application is a client-side Single Page Application (SPA) built with React. It uses **Puter.js** as a bridge to Large Language Models (LLM) (specifically Gemini 2.5 Flash) to generate visualization code.

### Data Flow
1. **User Input**: User enters a prompt in the `ChatInterface`.
2. **LLM Request**: App sends the prompt to `Puter.ai` via `src/lib/llm.ts`.
3. **Code Generation**: The LLM returns a raw HTML string containing the full visualization (Canvas/Three.js/JS).
4. **Rendering**: The `SimulationViewer` component injects this HTML into an `iframe` using `srcdoc` after injecting default styles to ensure full-viewport rendering.

## 2. Component Structure
```mermaid
graph TB
    subgraph Client ["Client Workstation"]
        style Client fill:#f9f9f9,stroke:#333,stroke-width:2px
        User([User])

        subgraph Browser ["Web Browser"]
            style Browser fill:#ffffff,stroke:#666

            subgraph Application ["VizuLab AI (React SPA)"]
                style Application fill:#e1f5fe,stroke:#01579b

                subgraph UI_Layer ["Presentation Layer"]
                    style UI_Layer fill:#e3f2fd,stroke:#2196f3
                    AppComp["App.tsx (Main Container)"]
                    LayoutComp["Layout Component"]
                    ChatComp["ChatInterface"]
                    SimComp["SimulationViewer"]
                end

                subgraph Logic_Layer ["Logic Layer"]
                    style Logic_Layer fill:#fff3e0,stroke:#ff9800
                    StateMgmt["React State (Messages, Code)"]
                    LLMService["src/lib/llm.ts"]
                end

                subgraph Isolation ["Sand/box Layer"]
                    style Isolation fill:#fbe9e7,stroke:#ff5722
                    Iframe["Sandboxed Iframe"]
                end
            end
        end
    end

    subgraph Cloud ["Cloud Services"]
        style Cloud fill:#f3e5f5,stroke:#4a148c
        PuterBridge["Puter.js Bridge"]
        GeminiFlash["Gemini 2.5 Flash Model"]
    end

    %% Interactions
    User -->|1. Enters Prompt| ChatComp
    ChatComp -->|2. Updates State| AppComp
    AppComp -->|3. Triggers Generation| LLMService
    LLMService -->|4. API Call| PuterBridge
    PuterBridge -->|5. Inference Request| GeminiFlash
    GeminiFlash -->|6. Returns HTML/JS Code| PuterBridge
    PuterBridge -->|7. Returns Response| LLMService
    LLMService -->|8. Returns Code| AppComp
    AppComp -->|9. Passes Code| SimComp
    SimComp -->|10. Injects into| Iframe
    Iframe -->|11. Renders Visualization| User
```

### Component Interaction Flow
```mermaid
sequenceDiagram
    participant User
    participant ChatInterface
    participant App
    participant LLMService
    participant PuterAPI
    participant SimulationViewer

    User->>ChatInterface: Types prompt & clicks Send
    ChatInterface->>App: onSendMessage(prompt)
    App->>App: setMessages(userMsg)
    App->>App: setIsLoading(true)
    App->>LLMService: generateSimulation(prompt)
    LLMService->>PuterAPI: puter.ai.chat(prompt)
    PuterAPI-->>LLMService: Returns generated code string
    LLMService-->>App: Returns code
    App->>App: setCodeString(code)
    App->>App: setMessages(systemMsg)
    App->>App: setIsLoading(false)
    App->>SimulationViewer: passes codeString
    SimulationViewer->>SimulationViewer: Injects code into iframe srcdoc
    SimulationViewer-->>User: Displays rendered simulation
```

- **App**: Root component, manages state `messages` and `codeString`.
- **Layout**: Handles the responsive split-screen grid.
- **SimulationViewer**: Receives `codeString` and renders it safely in an iframe. Includes a toggle to view and copy the raw source code. Shows a loading spinner when empty.
- **ChatInterface**: Manages user input, displays chat history, and handles "Quick Start" suggestions.
- **lib/llm.ts**: Handles the async call to `puter.ai.chat`.

## 3. Technology Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Puter.js (Gemini 2.5 Flash)

## 4. Security & Safety
- **Sandbox**: Generated code runs in a sandboxed `iframe` (`allow-scripts`, `allow-same-origin`) to isolate execution.
- **No Backend**: logic is client-side, relying on the Puter.js environment.

## 5. UI Theme
- **Dark Mode**: Primary background Slate 900 (`#0f172a`).
- **Accents**: Purple/Indigo gradients (`text-purple-400`, `bg-indigo-500`) for a "Sci-Fi/Lab" aesthetic.
- **Glassmorphism**: Usage of `backdrop-blur-md` and semi-transparent backgrounds.
