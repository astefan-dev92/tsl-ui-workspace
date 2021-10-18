module.exports = {
    onPreBuild: ({ utils }) => {
        const currentProject = process.env.PROJECT_NAME;
        const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
        const latestCommit = 'HEAD';

        console.log(process.env.CACHED_COMMIT_REF);
        const changed = hasProjectChanged(currentProject, lastDeployedCommit, latestCommit);

        if (!changed) {
            utils.build.cancelBuild(
                `Build was cancelled because ${currentProject} was not affected by the latest changes`
            );
        }
    }
};

const hasProjectChanged = (currentProject, fromHash, toHash) => {
    const execSync = require('child_process').execSync;

    const getAffectedOnMain = `nx print-affected --base=main~1 --head=main`;
    const getAffected = `nx print-affected --base=${fromHash} --head=${toHash}`;
    const output = execSync(getAffectedOnMain).toString();
    
    const changedProjects = JSON.parse(output).projects;
    console.log(changedProjects);
    if (changedProjects.find((project) => project === currentProject)) {
        return true;
    }

    return false;
}