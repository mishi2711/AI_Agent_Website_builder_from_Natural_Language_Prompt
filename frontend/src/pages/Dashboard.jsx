import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject } from '../api/api';

function Dashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await getProjects();
            setProjects(data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };

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

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading-overlay">
                    <span className="loading-spinner" />
                    <span>Loading projects...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard" id="dashboard-page">
            <div className="dashboard-header">
                <h1>Your Projects</h1>
                <button
                    className="btn btn-primary"
                    id="new-project-btn"
                    onClick={() => setShowModal(true)}
                >
                    + New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <p>No projects yet. Create your first one!</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="project-grid">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="card project-card"
                            id={`project-${project._id}`}
                            onClick={() => navigate(`/workspace/${project._id}`)}
                        >
                            <h3>{project.name}</h3>
                            <div className="project-meta">
                                <span>⚛️ {project.framework}</span>
                                <span>📅 {formatDate(project.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Create New Project</h2>
                        <p>Give your project a name to get started.</p>
                        <input
                            type="text"
                            className="input"
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

export default Dashboard;
