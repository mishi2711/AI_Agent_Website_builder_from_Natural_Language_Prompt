import { StateGraph, START, END } from '@langchain/langgraph';
import { plannerAgent } from './planner.js';
import { coderAgent } from './coder.js';

/**
 * Creates and compiles the LangGraph workflow.
 *
 * Graph structure:  START → planner → coder → END
 *
 * State channels:
 * State channels:
 *   prompt          - the user's prompt (input)
 *   projectId       - the project ID for logging
 *   currentCodebase - stringified representation of all current project files
 *   plan            - the planner's output
 *   files           - the coder's output (array of { path, content })
 *   message         - the AI's conversational response
 */
export const createGraph = () => {
    const workflow = new StateGraph({
        channels: {
            prompt: {
                value: (old, incoming) => incoming ?? old,
                default: () => '',
            },
            projectId: {
                value: (old, incoming) => incoming ?? old,
                default: () => '',
            },
            currentCodebase: {
                value: (old, incoming) => incoming ?? old,
                default: () => '',
            },
            plan: {
                value: (old, incoming) => incoming ?? old,
                default: () => '',
            },
            files: {
                value: (old, incoming) => incoming ?? old,
                default: () => [],
            },
            message: {
                value: (old, incoming) => incoming ?? old,
                default: () => '',
            },
        },
    })
        .addNode('planner', plannerAgent)
        .addNode('coder', coderAgent)
        .addEdge(START, 'planner')
        .addEdge('planner', 'coder')
        .addEdge('coder', END);

    return workflow.compile();
};
