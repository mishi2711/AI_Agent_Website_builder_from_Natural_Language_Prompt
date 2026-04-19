import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { emitLog } from '../utils/logger.js';

let model = null;
const getModel = () => {
    if (!model) {
        model = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            temperature: 0.2,
            apiKey: process.env.GEMINI_API_KEY
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
  "message": "Write a friendly conversational response here explaining what you did, or answering the user's question, or giving suggestions. Make sure to explain your architectural choices concisely! You can use Markdown.",
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
3. DEPENDENCIES: If you import a third-party library (like framer-motion, lucide-react, react-router-dom, etc.), you MUST modify \`package.json\` and append those dependencies into the \`"dependencies"\` object so the server can install them! Failure to update package.json will CRASH the server.
4. NO MISSING IMPORTS: If you import a CSS file, you MUST actually generate that identical file block in your JSON response.
5. NO LOCAL IMAGES: Use https://images.unsplash.com/photo-... or https://via.placeholder.com/... for images.
6. NO FLOATING COMPONENTS: If you create a new component, you MUST edit \`src/App.jsx\` to strictly import and render it!
7. GLOBAL STYLES: Use \`src/index.css\` and ensure it is imported in \`main.jsx\`.
8. EXPLANATION ONLY: If the user just asked a question ("how does routing work?"), return an empty array for "files" (\`"files": []\`) and put your entire response inside the "message" field! 
9. LAZY CODING IS STRICTLY FORBIDDEN: You must output the ENTIRE file perfectly without placeholder comments!
10. Do NOT wrap the JSON in code fences (\`\`\`json). Start immediately with { and end with }.
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
        const parsed = JSON.parse(response.content);
        files = parsed.files || [];
        message = parsed.message || '';
        emitLog(state.projectId, 'ai-coder', `Successfully parsed JSON with ${files.length} files.`);
    } catch {
        try {
            const jsonMatch = response.content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[1].trim());
                files = parsed.files || [];
                message = parsed.message || '';
            } else {
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
