import fs from 'fs-extra';
import path from 'path';

/**
 * Write multiple files to a project directory.
 * Creates directories if missing, overwrites existing files.
 */
export const writeFiles = async (projectPath, files) => {
    const written = [];

    for (const file of files) {
        const fullPath = path.join(projectPath, file.path);
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, file.content, 'utf-8');
        written.push(file.path);
    }

    return written;
};

/**
 * Recursively list files in a directory, excluding node_modules and .git
 */
export const listFiles = async (dirPath, basePath = '') => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    let results = [];

    for (const entry of entries) {
        // Skip these directories
        if (['node_modules', '.git', 'dist', '.vite'].includes(entry.name)) {
            continue;
        }

        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
            results.push({ name: entry.name, path: relativePath, type: 'directory' });
            const children = await listFiles(path.join(dirPath, entry.name), relativePath);
            results = results.concat(children);
        } else {
            results.push({ name: entry.name, path: relativePath, type: 'file' });
        }
    }

    return results;
};

/**
 * Read a single file's content from a project
 */
export const readFileContent = async (projectPath, filePath) => {
    const fullPath = path.join(projectPath, filePath);
    if (await fs.pathExists(fullPath)) {
        return await fs.readFile(fullPath, 'utf-8');
    }
    return null;
};
