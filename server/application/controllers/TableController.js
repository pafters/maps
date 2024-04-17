const TableManager = require('../modules/TableManager');
const bcrypt = require('bcryptjs');
const DBManager = require('../modules/db/DBManager');

class TableController {

    async getTable(req, res) {
        const { name, limit, offset } = req.query;

        const tableInfo = await TableManager.getTable(name, limit, offset);
        res.status(tableInfo.status).send(tableInfo.msg);
    }

    async deleteEntry(req, res) {
        const { name, id } = req.query;
        const deleteInfo = await TableManager.deleteEntry(name, id);
        res.status(deleteInfo.status).send(deleteInfo.msg);
    }

    async updateEntry(req, res) {
        const { name } = req.query;
        const { data } = req.body;
        const id = data.id;
        delete data.id;
        if (name == 'users') {
            const user = await DBManager.getUserById(id);
            if (user) {
                if (data?.password) {
                    const identical = `${data.password}` === `${user.password}`;

                    if (!identical) {
                        data.password = await bcrypt.hash(`${data.password}`, 8);
                    }
                }
            }
        }
        const updateInfo = await TableManager.updateEntry(name, id, data);
        res.status(updateInfo.status).send(updateInfo.msg);

    }
}

module.exports = new TableController();