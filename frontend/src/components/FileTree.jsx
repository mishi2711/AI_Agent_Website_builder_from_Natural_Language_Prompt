function FileTree({ files }) {
    if (!files || files.length === 0) {
        return (
            <div className="loading-overlay">
                <span>No files yet</span>
            </div>
        );
    }

    const getIcon = (item) => {
        if (item.type === 'directory') return '📁';
        const ext = item.name.split('.').pop();
        const icons = {
            jsx: '⚛️',
            js: '📜',
            css: '🎨',
            html: '🌐',
            json: '📋',
            md: '📝',
        };
        return icons[ext] || '📄';
    };

    const getIndent = (path) => {
        const depth = path.split('/').length - 1;
        return { paddingLeft: `${depth * 1.2 + 0.6}rem` };
    };

    return (
        <div className="file-tree" id="file-tree-container">
            {files.map((item, index) => (
                <div
                    key={index}
                    className={`file-tree-item ${item.type}`}
                    style={getIndent(item.path)}
                    title={item.path}
                >
                    <span className="file-icon">{getIcon(item)}</span>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    );
}

export default FileTree;
