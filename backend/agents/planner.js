import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { emitLog } from '../utils/logger.js';

let model = null;
const getModel = () => {
    if (!model) {
        model = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            temperature: 0.3,
            apiKey: process.env.GEMINI_API_KEY
        });
    }
    return model;
};

/**
 * Planner agent: analyzes the user prompt and creates a plan
 * describing which files need to be created or modified.
 */
export const plannerAgent = async (state) => {
    emitLog(state.projectId, 'info', 'Brainstorming necessary file changes and structure...');
    const response = await getModel().invoke([
        {
            role: 'system',
            content: `You are a website planning agent. Given a user prompt about website changes, create a clear, concise plan describing what files need to be created or modified and what changes to make.

<RULES>
1. Be specific about file paths (e.g., src/components/Navbar.jsx).
2. Describe what each file should contain.
3. Keep the plan brief but actionable.
4. Assume the project uses React with Vite. All component files go in the src/ directory.
5. CSS REQUIREMENT: If a component requires styling, you MUST explicitly plan to create the corresponding CSS file (e.g., src/components/Navbar.css) alongside it.
6. DEPENDENCIES: Only rely on standard React features. If you rigorously require an external library (like react-router-dom, lucide-react, framer-motion, or axios), explicitly plan to update or overwrite package.json to append those dependencies. DO NOT over-install unnecessary packages.
7. IMAGES: Plan to use placeholder URLs like https://images.unsplash.com/photo-XXX or https://via.placeholder.com/XXX. Do NOT assume any local image files exist.
8. APP ARCHITECTURE: If you plan to add a layout (like a Navbar and a Footer), explicitly state that they should mount inside src/App.jsx.
9. MODERN DESIGN: Default to planning modern flexbox/grid layouts. Plan for generous padding, rounded corners, and subtle box-shadows.
10. RESPONSIVE DESIGN: Explicitly mention writing media queries to handle mobile and desktop views in your planned CSS files.
11. CONVERSATIONAL QUERIES: If the user simply asks a general question ("how does this work?") without requesting a code modification, your plan should explicitly state "Explain Only" with no file changes planned.
</RULES>`,
        },
        {
            role: 'user',
            content: `${state.currentCodebase}\n\nUser Request: ${state.prompt}`,
        },
    ]);

    emitLog(state.projectId, 'ai-planner', `Plan generated:\n${response.content}`);
    return { plan: response.content };
};
