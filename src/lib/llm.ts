// Declare puter global to avoid TS errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const puter: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractTextFromResponse = (res: any): string => {
    if (!res) return "";
    if (typeof res === 'string') return res;
    if (Array.isArray(res)) return res.map(extractTextFromResponse).join('\n');
    if (typeof res === 'object') {
        const text = res.message?.content || res.text || res[0]?.message?.content;
        return text ? extractTextFromResponse(text) : JSON.stringify(res);
    }
    return String(res);
};

export const generateSimulation = async (prompt: string, method: string = "Auto-Detect", aiModel: string = "google/gemma-3n-e4b-it:free"): Promise<string> => {
    if (typeof puter === 'undefined') {
        console.error("Puter.js not loaded.");
        throw new Error("Puter.js library is not loaded. Please refresh the page and check your connection.");
    }

    try {
        const methodRequirement = (method && method !== "Auto-Detect") 
            ? `\n6. ENGINE REQUIREMENT:\n   - You MUST use ${method} as the primary rendering engine/library.` 
            : `\n6. ENGINE REQUIREMENT:\n   - Intelligently select Three.js for 3D, or p5.js / Canvas API for 2D to create the best graphical output.`;

        const systemPrompt = `You are a world-class Expert Creative Coder and Simulation Architect. Your ONLY purpose is to write perfectly functional, extremely advanced, logically robust, and visually stunning interactive web visualizations.
Your output must be EXACTLY ONE standalone HTML file containing all necessary HTML, CSS, and JS. 
DO NOT INCLUDE MARKDOWN, NO EXPLANATIONS, NO \`\`\`html tags. Output ONLY raw HTML.

CORE RULES:
1. PERFECTION & CORRECTNESS: 
   - The physics, math, and logic for the requested simulation must be 100% accurate and mathematically sound.
   - The code must be production-ready: no missing variables, no syntax errors, no console errors.
   - Handle edge cases, ensure variables are properly initialized, use requestAnimationFrame correctly.
2. STANDALONE & COMPLETE:
   - Everything goes into a SINGLE raw HTML string. All external dependencies MUST be imported securely via CDNs (e.g. unpkg, cdnjs).
   - If using Three.js, you MUST use an import map. E.g., <script type="importmap"> {"imports": {"three": "https://unpkg.com/three@0.160.0/build/three.module.js", "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"}} </script>.
3. HIGH-END AESTHETICS:
   - Must be visually breathtaking! Use advanced techniques like glows, bloom, particles, sleek gradients, and dynamic neon colors on a deep dark canvas.
   - Provide highly polished, smooth, and engaging micro-animations. Make it look like a premium award-winning cyber/sci-fi interface or high-end artistic simulation.
4. INTERACTIVITY:
   - Perfectly handle window resizing.
   - Implement satisfying, ultra-smooth mouse/touch interactions (e.g. repelling logic, dragging, parallax).
5. FORMATTING STRICTNESS:
   - The VERY FIRST character emitted must be '<!DOCTYPE html>'.
   - Do NOT wrap the response in markdown blocks. Output pure, valid HTML.${methodRequirement}

USER REQUEST: "${prompt}"`;

        console.log(`Generating simulation with ${aiModel}...`);
        
        const response = await puter.ai.chat(systemPrompt, { model: aiModel });
        let finalHtml = extractTextFromResponse(response);

        if (!finalHtml) throw new Error("Empty response received during generation.");

        // Safe cleanup formatting artifacts
        finalHtml = finalHtml.replace(/```(html)?/gi, "").replace(/```/g, "").trim();
        
        // Extract inner HTML if provided within larger response
        const htmlMatch = finalHtml.match(/(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i);
        if (htmlMatch) finalHtml = htmlMatch[1];

        console.log("Generation complete.");
        return finalHtml;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};
