import { useState, useEffect, useRef } from 'react';
import { SERVER_URL } from '../api/api';

const TerminalLogs = ({ projectId }) => {
    const [logs, setLogs] = useState([]);
    const logsEndRef = useRef(null);

    useEffect(() => {
        if (!projectId) return;

        // Connect to SSE Endpoint
        const eventSource = new EventSource(`${SERVER_URL}/projects/${projectId}/logs`);

        eventSource.onmessage = (event) => {
            try {
                const log = JSON.parse(event.data);
                setLogs((prev) => [...prev, log]);
            } catch (err) {
                console.error('Failed to parse log event', err);
            }
        };

        eventSource.onerror = () => {
            // Usually normal when server restarts, but good to know
            console.log('SSE connection disconnected. Reconnecting...');
        };

        return () => {
            eventSource.close();
        };
    }, [projectId]);

    useEffect(() => {
        // Auto-scroll to bottom of logs
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const stripAnsi = (str) => {
        return str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
    };

    const getLogColor = (type) => {
        switch (type) {
            case 'error': return '#ff5f56';
            case 'warn': return '#ffbd2e';
            case 'ai-planner': return '#27c93f';
            case 'ai-coder': return '#7c64ff';
            case 'dev-server': return '#00d2ff';
            default: return '#cccccc';
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            backgroundColor: '#1e1e1e', color: '#fff', padding: '10px',
            fontFamily: 'monospace', fontSize: '12px', overflowY: 'auto',
            borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px'
        }}>
            <div style={{ flex: 1 }}>
                {logs.length === 0 && <div style={{ color: '#888', fontStyle: 'italic' }}>Waiting for logs...</div>}
                {logs.map((log, index) => (
                    <div key={index} style={{ marginBottom: '4px', display: 'flex' }}>
                        <span style={{ color: '#888', marginRight: '8px', minWidth: '60px' }}>
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span style={{ color: getLogColor(log.type), fontWeight: 'bold', marginRight: '8px', minWidth: '85px' }}>
                            [{log.type}]
                        </span>
                        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            {stripAnsi(log.message)}
                        </span>
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default TerminalLogs;
