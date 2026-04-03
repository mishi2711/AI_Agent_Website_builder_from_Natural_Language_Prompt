import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    getProject,
    getFiles,
    getCommits,
    getMessages,
    sendPrompt,
    revertToCommit,
    startDevServer,
    getServerStatus,
    getFileContent,
    updateFileContent,
} from '../api/api';
import FileTree from '../components/FileTree';
import PromptPanel from '../components/PromptPanel';
import CommitHistory from '../components/CommitHistory';
import TerminalLogs from '../components/TerminalLogs';

function Workspace() {
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [files, setFiles] = useState([]);
    const [commits, setCommits] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReverting, setIsReverting] = useState(false);
    const [previewPort, setPreviewPort] = useState(null);
    const [serverLoading, setServerLoading] = useState(false);
    const [savingFile, setSavingFile] = useState(false);
    const [rightTab, setRightTab] = useState('prompt'); // 'prompt' | 'history' | 'logs'
    const [openTabs, setOpenTabs] = useState(['Preview']); // array of string paths/ids
    const [activeTab, setActiveTab] = useState('Preview');
    const [fileContents, setFileContents] = useState({}); // path -> content string

    // ── Data Fetching ──────────────────────────────
    const fetchProjectData = useCallback(async () => {
        try {
            const [projRes, filesRes, commitsRes, msgsRes] = await Promise.all([
                getProject(projectId),
                getFiles(projectId),
                getCommits(projectId),
                getMessages(projectId),
            ]);

            setProject(projRes.data);
            setFiles(filesRes.data);
            setCommits(commitsRes.data);
            setMessages(msgsRes.data);
        } catch (err) {
            console.error('Failed to load project:', err);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectData();
        checkServerStatus();
    }, [fetchProjectData]);

    // ── Dev Server ─────────────────────────────────
    const checkServerStatus = async () => {
        try {
            const { data } = await getServerStatus(projectId);
            if (data.running) {
                setPreviewPort(data.port);
            }
        } catch {
            // Server status check failed, ignore
        }
    };

    const handleStartServer = async () => {
        setServerLoading(true);
        try {
            const { data } = await startDevServer(projectId);
            setPreviewPort(data.port);
        } catch (err) {
            console.error('Failed to start dev server:', err);
            alert('Failed to start dev server. Make sure npm dependencies are installed.');
        } finally {
            setServerLoading(false);
        }
    };

    // ── AI Prompt ──────────────────────────────────
    const handleSendPrompt = async (prompt) => {
        // Optimistically add user message
        setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
        setIsLoading(true);

        try {
            const { data } = await sendPrompt(projectId, prompt);

            // Add assistant response
            const assistantMsg = `✅ Generated ${data.modifiedFiles.length} file(s):\n${data.modifiedFiles.map((f) => `• ${f}`).join('\n')}`;
            setMessages((prev) => [...prev, { role: 'assistant', content: assistantMsg }]);

            // Refresh files and commits
            const [filesRes, commitsRes] = await Promise.all([
                getFiles(projectId),
                getCommits(projectId),
            ]);
            setFiles(filesRes.data);
            setCommits(commitsRes.data);
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `❌ Error: ${errorMsg}` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Revert ─────────────────────────────────────
    const handleRevert = async (commitHash) => {
        if (!confirm('Are you sure you want to revert to this commit? Current changes will be lost.')) {
            return;
        }

        setIsReverting(true);
        try {
            const { data } = await revertToCommit(projectId, commitHash);

            // Refresh everything
            await fetchProjectData();

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `⏪ Reverted to commit ${commitHash.substring(0, 7)}`,
                },
            ]);
        } catch (err) {
            alert('Failed to revert: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsReverting(false);
        }
    };

    if (!project) {
        return (
            <div className="loading-overlay" style={{ height: 'calc(100vh - 60px)' }}>
                <span className="loading-spinner" />
                <span>Loading workspace...</span>
            </div>
        );
    }

    const handleFileClick = async (filePath) => {
        if (!openTabs.includes(filePath)) {
            setOpenTabs([...openTabs, filePath]);
        }
        setActiveTab(filePath);

        // Fetch content if not already fetched
        if (!fileContents[filePath]) {
            try {
                // Remove leading slash if any
                const pathParam = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                const { data } = await getFileContent(projectId, pathParam);
                setFileContents((prev) => ({ ...prev, [filePath]: data.content }));
            } catch (err) {
                console.error('Failed to get file content:', err);
                setFileContents((prev) => ({ ...prev, [filePath]: '// Error loading file content' }));
            }
        }
    };

    const closeTab = (e, tab) => {
        e.stopPropagation();
        const newTabs = openTabs.filter((t) => t !== tab);
        setOpenTabs(newTabs);
        if (activeTab === tab) {
            setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : '');
        }
    };

    const handleSaveFile = async (filePath) => {
        setSavingFile(true);
        try {
            const pathParam = filePath.startsWith('/') ? filePath.substring(1) : filePath;
            await updateFileContent(projectId, pathParam, fileContents[filePath]);
            
            // Re-fetch files to ensure the file tree is up to date
            const { data } = await getFiles(projectId);
            setFiles(data);
        } catch (err) {
            console.error('Failed to save file:', err);
            alert('Failed to save file');
        } finally {
            setSavingFile(false);
        }
    };

    return (
        <div className="workspace" id="workspace-page">
            {/* ── Left Panel: File Tree ────────────────── */}
            <div className="panel" id="file-panel">
                <div className="panel-header">
                    <h3>Files</h3>
                </div>
                <div className="panel-body">
                    <FileTree files={files} onFileClick={handleFileClick} />
                </div>
            </div>

            {/* ── Center: Preview/Code ──────────────────────── */}
            <div className="preview-panel" id="preview-panel">
                <div className="file-tabs" style={{ display: 'flex', background: '#1e1e24', borderBottom: '1px solid #333' }}>
                    {openTabs.map((tab) => (
                        <div 
                            key={tab} 
                            style={{
                                padding: '10px 15px', 
                                borderRight: '1px solid #333', 
                                background: activeTab === tab ? '#282a36' : 'transparent',
                                color: activeTab === tab ? '#fff' : '#888',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'Preview' ? '🌐 Preview' : tab.split('/').pop()}
                            {tab !== 'Preview' && (
                                <span 
                                    onClick={(e) => closeTab(e, tab)}
                                    style={{ marginLeft: '10px', fontSize: '12px', opacity: 0.7 }}
                                >
                                    ✖
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {activeTab === 'Preview' ? (
                    <>
                        <div className="preview-toolbar">
                            <div className="url-bar">
                                <span>🌐</span>
                                <span>
                                    {previewPort
                                        ? `http://localhost:${previewPort}`
                                        : 'Preview not running'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                {previewPort ? (
                                    <span className="status-badge running">
                                        <span className="status-dot" />
                                        Port {previewPort}
                                    </span>
                                ) : (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        id="start-server-btn"
                                        onClick={handleStartServer}
                                        disabled={serverLoading}
                                    >
                                        {serverLoading ? (
                                            <>
                                                <span className="loading-spinner" /> Starting...
                                            </>
                                        ) : (
                                            '▶ Start Preview'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {previewPort ? (
                            <iframe
                                className="preview-frame"
                                id="preview-iframe"
                                src={`http://localhost:${previewPort}`}
                                title="Project Preview"
                            />
                        ) : (
                            <div className="preview-placeholder">
                                <div className="placeholder-icon">🖥️</div>
                                <p>Start the dev server to see your preview</p>
                                {!serverLoading && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleStartServer}
                                    >
                                        Start Dev Server
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                ) : activeTab ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#282a36' }}>
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #333' }}>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSaveFile(activeTab)}
                                disabled={savingFile}
                            >
                                {savingFile ? 'Saving...' : '💾 Save File'}
                            </button>
                        </div>
                        <textarea
                            style={{ 
                                flex: 1, 
                                backgroundColor: 'transparent', 
                                color: '#f8f8f2', 
                                padding: '20px', 
                                fontFamily: 'monospace', 
                                whiteSpace: 'pre-wrap',
                                border: 'none',
                                outline: 'none',
                                resize: 'none'
                            }}
                            value={fileContents[activeTab] || ''}
                            onChange={(e) => setFileContents({ ...fileContents, [activeTab]: e.target.value })}
                            spellCheck="false"
                        />
                    </div>
                ) : (
                    <div className="preview-placeholder">
                        <p>No file open</p>
                    </div>
                )}
            </div>

            {/* ── Right Panel: Prompt + History ─────────── */}
            <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="tabs">
                    <button
                        className={`tab ${rightTab === 'prompt' ? 'active' : ''}`}
                        onClick={() => setRightTab('prompt')}
                    >
                        💬 AI Prompt
                    </button>
                    <button
                        className={`tab ${rightTab === 'history' ? 'active' : ''}`}
                        onClick={() => setRightTab('history')}
                    >
                        🕐 Commits
                    </button>
                    <button
                        className={`tab ${rightTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setRightTab('logs')}
                    >
                        🖥️ Logs
                    </button>
                </div>

                {rightTab === 'prompt' && (
                    <PromptPanel
                        messages={messages}
                        onSendPrompt={handleSendPrompt}
                        isLoading={isLoading}
                    />
                )}
                {rightTab === 'history' && (
                    <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
                        <CommitHistory
                            commits={commits}
                            onRevert={handleRevert}
                            isReverting={isReverting}
                        />
                    </div>
                )}
                {rightTab === 'logs' && (
                    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <TerminalLogs projectId={projectId} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Workspace;
