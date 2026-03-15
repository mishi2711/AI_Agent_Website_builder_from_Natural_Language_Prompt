import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/api';

function Home() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!projectName.trim()) return;
        setIsCreating(true);
        try {
            const { data } = await createProject(projectName.trim());
            navigate(`/workspace/${data.projectId}`);
        } catch (err) {
            alert('Failed to create project: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="home" id="home-page">
            <div className="home-badge">
                <span>✨</span>
                <span>AI-Powered Website Builder</span>
            </div>

            <h1>
                Build Websites with
                <br />
                <span className="gradient-text">AI Agents</span>
            </h1>

            <p>
                Create, modify, and version-control your websites using natural language prompts.
                Powered by LangGraph agents with automatic Git versioning.
            </p>

            <div className="home-actions">
                <button
                    className="btn btn-primary btn-lg"
                    id="create-project-btn"
                    onClick={() => setShowModal(true)}
                >
                    ⚡ Create Project
                </button>
                <button
                    className="btn btn-secondary btn-lg"
                    onClick={() => navigate('/dashboard')}
                >
                    View Projects
                </button>
            </div>

            <div className="home-features">
                <div className="card feature-card">
                    <div className="feature-icon">🤖</div>
                    <h3>AI Agents</h3>
                    <p>LangGraph planner and coder agents generate and modify your website code.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🔄</div>
                    <h3>Git Versioning</h3>
                    <p>Every AI change creates a Git commit. Revert to any previous version instantly.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">💬</div>
                    <h3>Conversation History</h3>
                    <p>All prompts and AI responses are stored in MongoDB for full traceability.</p>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Create New Project</h2>
                        <p>Give your project a name to get started.</p>
                        <input
                            type="text"
                            className="input"
                            id="project-name-input"
                            placeholder="My Awesome Website"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                id="confirm-create-btn"
                                onClick={handleCreate}
                                disabled={isCreating || !projectName.trim()}
                            >
                                {isCreating ? (
                                    <>
                                        <span className="loading-spinner" /> Creating...
                                    </>
                                ) : (
                                    'Create Project'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
