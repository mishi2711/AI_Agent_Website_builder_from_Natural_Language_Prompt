function CommitHistory({ commits, onRevert, isReverting }) {
    if (!commits || commits.length === 0) {
        return (
            <div className="loading-overlay">
                <span>No commits yet</span>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="commit-list" id="commit-history">
            {commits.map((commit, i) => (
                <div key={i} className="commit-item">
                    <div className="commit-info">
                        <div className="commit-prompt" title={commit.prompt || commit.message}>
                            {commit.prompt || commit.message}
                        </div>
                        <div className="commit-hash">{commit.commitHash?.substring(0, 7)}</div>
                        <div className="commit-date">{formatDate(commit.date || commit.createdAt)}</div>
                    </div>
                    {i > 0 && (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onRevert(commit.commitHash)}
                            disabled={isReverting}
                        >
                            Revert
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CommitHistory;
