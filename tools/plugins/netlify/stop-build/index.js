module.exports = {
    onPreBuild: ({ utils }) => {
        const currentProject = process.env.PROJECT_NAME;
        const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
        const latestCommit = 'HEAD';

        const changed = hasProjectChanged(currentProject, lastDeployedCommit, latestCommit);

        if (!changed) {
            utils.build.cancelBuild(
                `Build was cancelled because ${currentProject} was not affect by the latest changes`
            );
        }
    }
};

const hasProjectChanged = (currentProject, fromHash, toHash) => {
    const execSync = require('child_process').execSync;
    const getAffected = `nx print-affected --base=main --head=${toHash}`;
    const output = execSync(getAffected).toString();

    const changedProjects = JSON.parse(output).projects;

    if (changedProjects.find((project) => project === currentProject)) {
        return true;
    }

    return false;
}