import { Router } from 'express';
import {
    handleCreateProject,
    handleGetProjects,
    handleGetProject,
    handleGetCommits,
    handleGetFiles,
    handleGetFileContent,
    handleRevert,
    handleGetMessages,
    handleStartDevServer,
    handleStopDevServer,
    handleServerStatus,
    handleGetLogs,
} from '../controllers/projectController.js';

const router = Router();

// Project CRUD
router.post('/create', handleCreateProject);
router.get('/', handleGetProjects);
router.get('/:id', handleGetProject);

// Git operations
router.get('/:id/commits', handleGetCommits);
router.post('/revert', handleRevert);

// File operations
router.get('/:id/files', handleGetFiles);
router.get('/:id/files/*', handleGetFileContent);

// Conversations
router.get('/:id/messages', handleGetMessages);

// Dev server management
router.post('/:id/start', handleStartDevServer);
router.post('/:id/stop', handleStopDevServer);
router.get('/:id/server-status', handleServerStatus);
router.get('/:id/logs', handleGetLogs);

export default router;
