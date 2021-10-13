module.exports = {
    onPreBuild: ({ utils }) => {
        const currentProject = 'admin-experience';
        const projectHasChanged = false;

        if (!projectHasChanged) {
            utils.build.cancelBuild(
                `Build was cancelled because ${currentProject} was not affect by the latest changes`
            );
        }
    }
};