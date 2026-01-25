# Requirements

## 1. Core Functionality
- [x] **General Purpose generation**: The application must be able to generate visualizations/simulations for *any* user prompt.
- [x] **Dynamic Code Generation**: System generates executable HTML/JS/Canvas/Three.js code.
- [x] **Live Preview**: Generated code is immediately rendered in an interactive viewer.

## 2. User Interface (UI)
- [x] **Branding**: "VizuLab AI" name and logo.
- [x] **Modern & Premium**: Dark, sleek, glassmorphism-inspired design (Slate/Purple theme).
- [x] **Chat Interface**: Chat-like input for providing prompts and viewing system status.
- [x] **Code View**: Option to view and copy the generated source code.

## 3. Technical Requirements
- [x] **LLM Integration**: Uses **Puter.js** to access Gemini 2.5 Flash.
- [x] **No API Key Required**: Leverages Puter.js environment (no user API key needed).
- [x] **Safe Rendering**: Isolates generated code using `iframe` with `sandbox`.
- [x] **Error Handling**: Graceful handling of generation failures.
- [x] **Type Safety**: Strict TypeScript configuration with no explicit `any`.

## 4. Documentation
- [x] **Architecture & Design**: Documented in `design.md`.
- [x] **Setup Instructions**: Instructions in `README.md`.
