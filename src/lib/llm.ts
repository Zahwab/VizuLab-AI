// Declare puter global to avoid TS errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const puter: any;

export const generateSimulation = async (prompt: string): Promise<string> => {
    // Check if puter is loaded
    if (typeof puter === 'undefined') {
        console.error("Puter.js not loaded. 'puter' object is undefined.");
        throw new Error("Puter.js library is not loaded. Please refresh the page and checks your internet connection.");
    }

    const systemPrompt = `
  You are an expert Frontend Developer and Creative Coder.
  Your task is to generate a SINGLE, standalone HTML file containing a visualization or simulation based on the user's request.

  RULES:
  1. Return ONLY the raw HTML code. Do NOT wrap it in markdown blocks (no \`\`\`html or \`\`\`).
  2. The HTML must be self-contained:
     - CSS in <style> tags.
     - JS in <script> tags.
     - No external CSS/JS file references (unless using a CDN for libraries like Three.js, p5.js, D3.js, etc.).
  3. Design Aesthetic:
     - Dark mode default (bg-slate-900 or black).
     - Modern, clean, and professional.
     - Use Canvas API or WebGL/Three.js if appropriate for high-performance visuals.
  4. Interactivity:
     - Make it interactive if possible (mouse movement, clicks, etc.).
     - handle window resizing.
  5. Libraries:
     - You MAY use ES modules from CDNs (e.g., https://unpkg.com/three@0.160.0/build/three.module.js).
     - If using Three.js, use an importmap.

  USER REQUEST: "${prompt}"
  `;

    try {
        console.log("Sending request to Puter.js with model: gemini-2.5-flash");
        const response = await puter.ai.chat(systemPrompt, { model: 'gemini-2.5-flash' });

        console.log("Puter.js Response:", response);

        let generatedText = "";

        // Puter.js chat response handling
        // If the response is a simple string, use it.
        // If it's an object, try to extract message content.
        if (typeof response === 'string') {
            generatedText = response;
        } else if (typeof response === 'object') {
            if (response.message && response.message.content) {
                generatedText = response.message.content;
            } else if (response.text) {
                generatedText = response.text;
            } else if (Array.isArray(response) && response.length > 0 && response[0].message) {
                // Handle potential array response
                generatedText = response[0].message.content;
            } else {
                console.warn("Unexpected response structure object:", response);
                generatedText = JSON.stringify(response);
            }
        } else {
            // Fallback
            console.warn("Unexpected response type:", typeof response);
            generatedText = String(response);
        }

        if (!generatedText) {
            throw new Error("Empty response received from Gemini API");
        }

        // Cleanup cleanup markdown if the model disregarded the instruction
        generatedText = generatedText.replace(/```html/g, "").replace(/```/g, "");

        return generatedText;
    } catch (error) {
        console.error("Gemini API connecting through Puter.js Error:", error);
        throw error;
    }
};
