import { EventEmitter } from 'events';

export const logEmitter = new EventEmitter();

// In-memory rotating buffer of the last 200 logs
const logBuffer = [];
const MAX_LOGS = 200;

export const getLogBuffer = (projectId) => {
    return logBuffer.filter(l => l.projectId === projectId);
};

/**
 * Emits a log event that can be sent to the frontend via SSE.
 * 
 * @param {string} projectId - The ID of the project
 * @param {string} type - 'info', 'warn', 'error', 'ai-planner', 'ai-coder', 'dev-server'
 * @param {string} message - The message to log
 */
export const emitLog = (projectId, type, message) => {
    const log = { projectId, type, message, timestamp: Date.now() };
    
    // Add to buffer and prune
    logBuffer.push(log);
    if (logBuffer.length > MAX_LOGS) {
        logBuffer.shift();
    }

    logEmitter.emit('log', log);

    // Also log to console for backend debugging
    if (type === 'error') {
        console.error(`[${type}] ${projectId}: ${message}`);
    } else {
        console.log(`[${type}] ${projectId}: ${message}`);
    }
};
