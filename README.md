# VizuLab AI / LogicLoom

**VizuLab AI** (also known as LogicLoom) is a next-generation Generative Simulation Engine. It allows users to generate interactive visualizations, simulations, and educational models simply by describing them in natural language.

Powered by a Large Language Model (LLM), VizuLab AI instantly writes and renders HTML/JS/Canvas/Three.js code to bring your ideas to life.

## Features

- **Generative Physics & Logic**: Create sorting algorithms, fractals, physics simulations, or data visualizations from a text prompt.
- **Interactive Preview**: Live, sandboxed execution of generated code.
- **Modern UI**: A sleek, dark-themed, glassmorphism-inspired interface.
- **Secure**: Client-side API key management and safe iframe rendering.
- **Code Inspection**: View and copy the underlying code for any simulation.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React
- **AI/LLM**: Integration with Google Gemini (or compatible LLMs)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VizuLab-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Building for Production**
   To create a production build:
   ```bash
   npm run build
   ```

5. **Linting**
   To check for code quality issues:
   ```bash
   npm run lint
   ```

6. **Open in Browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

7. **Start Generating**
   - No API key required! The app uses specific integration for generic users.
   - Simply type a prompt and hit send.