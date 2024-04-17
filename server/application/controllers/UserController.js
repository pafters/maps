const UserManager = require('../modules/UserManager');

class UserController {

    async auth(req, res) {
        const { login, password } = req.body;
        const userInfo = await UserManager.auth(login, password);
        
        res.status(userInfo.status).send(userInfo.msg);
    }

    async insertUser(req, res) {
        const { login, password } = req.body?.data;
        const userInfo = await UserManager.insertUser(login, password);

        res.status(userInfo.status).send(userInfo.msg);
    }

    async getMe(req, res) {
        const { token } = req.query;
        const userInfo = await UserManager.getMe(token);

        res.status(userInfo.status).send(userInfo.msg);
    }
}

module.exports = new UserController();