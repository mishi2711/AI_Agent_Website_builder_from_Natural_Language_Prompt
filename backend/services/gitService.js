import simpleGit from 'simple-git';

/**
 * Initialize a new Git repository and make the initial commit
 */
export const initRepo = async (repoPath) => {
    const git = simpleGit(repoPath);
    await git.init();
    await git.add('.');
    await git.commit('Initial template');
    const log = await git.log();
    return log.latest.hash;
};

/**
 * Stage all changes and create a commit
 */
export const commitChanges = async (repoPath, message) => {
    const git = simpleGit(repoPath);
    await git.add('.');

    // Check if there are changes to commit
    const status = await git.status();
    if (status.files.length === 0) {
        // No changes to commit, return latest hash
        const log = await git.log();
        return log.latest.hash;
    }

    await git.commit(message);
    const log = await git.log();
    return log.latest.hash;
};

/**
 * Get commit history for a repository
 */
export const getCommits = async (repoPath) => {
    const git = simpleGit(repoPath);
    const log = await git.log();
    return log.all.map((entry) => ({
        commitHash: entry.hash,
        message: entry.message,
        date: entry.date,
        author: entry.author_name,
    }));
};

/**
 * Revert the repository to a specific commit using hard reset
 */
export const revertToCommit = async (repoPath, commitHash) => {
    const git = simpleGit(repoPath);
    await git.reset(['--hard', commitHash]);
};
