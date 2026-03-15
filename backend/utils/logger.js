import { EventEmitter } from 'events';

export const logEmitter = new EventEmitter();

/**
 * Emits a log event that can be sent to the frontend via SSE.
 * 
 * @param {string} projectId - The ID of the project
 * @param {string} type - 'info', 'warn', 'error', 'ai-planner', 'ai-coder', 'dev-server'
 * @param {string} message - The message to log
 */
export const emitLog = (projectId, type, message) => {
    const log = { projectId, type, message, timestamp: Date.now() };
    logEmitter.emit('log', log);

    // Also log to console for backend debugging
    if (type === 'error') {
        console.error(`[${type}] ${projectId}: ${message}`);
    } else {
        console.log(`[${type}] ${projectId}: ${message}`);
    }
};
