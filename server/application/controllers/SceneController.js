const SceneManager = require('../modules/SceneManager');

class SceneController {

    async createScene(req, res) {
        await SceneManager.deleteOldScenes();
        const configs = req.body.configs;
        const createInfo = await SceneManager.createScene(configs);
        res.status(createInfo.status).send(createInfo.msg);
    }

    async getScene(req, res) {
        const token = req.params.token;
        const data = await SceneManager.getScene(token)
        res.status(data.status).send(data.msg)
    }

    // async updateScene(req, res) {
    //     const token = req.headers.token;
    //     const photos = req.files;
    //     const configs = req.body.configs;
    //     const updateInfo = await SceneManager.updateScene(token, photos, configs)
    // }


}

module.exports = new SceneController();