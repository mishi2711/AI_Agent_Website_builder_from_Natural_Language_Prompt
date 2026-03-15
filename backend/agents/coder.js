import { ChatGroq } from '@langchain/groq';
import { emitLog } from '../utils/logger.js';

let model = null;
const getModel = () => {
    if (!model) {
        model = new ChatGroq({
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
        });
    }
    return model;
};

/**
 * Coder agent: receives the user prompt and plan, then generates
 * file contents as structured JSON.
 */
export const coderAgent = async (state) => {
    emitLog(state.projectId, 'info', 'Generating file contents based on plan...');
    const response = await getModel().invoke([
        {
            role: 'system',
            content: `You are a website coding agent. Given a user request and a plan, generate the necessary file changes.

You MUST respond with ONLY valid JSON in this exact format:
{
  "message": "Write a friendly conversational response here explaining what you did, or answering the user's question, or giving suggestions. You can use Markdown.",
  "files": [
    {
      "path": "src/components/Example.jsx",
      "content": "import './Example.css';\\n\\nexport default function Example() { return <div className=\\"example\\">Hello</div>; }"
    },
    {
      "path": "src/components/Example.css",
      "content": ".example { color: red; }"
    }
  ]
}

<CRITICAL RULES>
1. All file paths must be relative to the project root (e.g. src/).
2. Include the COMPLETE file content, not snippets.
3. NO EXTERNAL LIBRARIES: You may ONLY import from 'react', 'react-dom', 'react-router-dom', and 'axios'. ANY other third-party import (like framer-motion, lucide-react, react-slick, etc.) WILL CRASH the server. Write custom logic and CSS from scratch!
4. NO MISSING IMPORTS: If you import a CSS file (e.g., \`import './Navbar.css';\`), you MUST actually generate that identical file block in your JSON response. Failure to generate an imported file WILL CRASH the server.
5. NO LOCAL IMAGES: Use https://images.unsplash.com/photo-... or https://via.placeholder.com/... for image sources. Never reference local images like './logo.png' because you cannot generate binary files.
6. NO FLOATING COMPONENTS: If you create a new feature or component, you MUST also edit \`src/App.jsx\` to strictly import and render that component, otherwise the user will never see it!
7. GLOBAL STYLES: If the user asks to change the background color of the webpage, global fonts, or generic styles, you MUST modify \`src/index.css\` directly using \`body { ...; margin: 0; min-height: 100vh; }\`. You MUST also rewrite \`src/main.jsx\` to include \`import './index.css';\` so the styles actually load! Do not build a completely separate wrapper component just to change the generic background color.
8. REACT 18 ONLY: If you absolutely must modify main.jsx or index.jsx, you MUST use React 18 \`createRoot\` API. Do NOT use \`ReactDOM.render\`.
9. LAZY CODING IS STRICTLY FORBIDDEN: You must output the ENTIRE file perfectly. Do NOT use placeholder comments like \`// existing code remains\` or \`/* rest of file */\`. If you modify a file, you must rewrite the ENTIRE completely working file from top to bottom!
10. Do NOT include any text, markdown formatting, or explanation outside the JSON object itself.
11. Do NOT wrap the JSON in code fences (\`\`\`json). Start immediately with { and end with }.
</CRITICAL RULES>`
        },
        {
            role: 'user',
            content: `${state.currentCodebase}\n\nUser request: ${state.prompt}\n\nPlan:\n${state.plan}\n\nGenerate the files as valid JSON.`,
        },
    ]);

    let files = [];
    let message = '';

    try {
        // Try direct JSON parse first
        const parsed = JSON.parse(response.content);
        files = parsed.files || [];
        message = parsed.message || '';
        emitLog(state.projectId, 'ai-coder', `Successfully parsed JSON with ${files.length} files.`);
    } catch {
        // Try to extract JSON from the response (handles markdown fences)
        try {
            const jsonMatch = response.content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[1].trim());
                files = parsed.files || [];
            } else {
                // Try finding raw JSON object
                const objectMatch = response.content.match(/\{[\s\S]*"files"[\s\S]*\}/);
                if (objectMatch) {
                    const parsed = JSON.parse(objectMatch[0]);
                    files = parsed.files || [];
                    message = parsed.message || '';
                }
            }
        } catch (innerError) {
            console.error('Failed to parse coder output:', innerError.message);
            console.error('Raw output:', response.content.substring(0, 500));
            emitLog(state.projectId, 'error', `Failed to parse AI output into files. Ensure it generated valid JSON.`);
        }
    }

    return { files, message };
};
