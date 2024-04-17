const DBManager = require('./db/DBManager');

class TableManager {

    async getTable(tableName, limit, offset) {
        const table = await DBManager.getTable(tableName, limit, offset);
        if (table)
            return { msg: { table: table }, status: 200 }
        else return { msg: { err: 'Ошибка: Таблица не найдена' }, status: 400 }
    }

    async deleteEntry(tableName, id) {
        if (tableName === 'tours') {
            const delPhotosInfo = await DBManager.deleteAllEntryByTourId('photos', id);
            const delAvatarInfo = await DBManager.deleteAllEntryByTourId('avatars', id);
        }
        const answer = await DBManager.deleteEntry(tableName, id);
        if (answer[0])
            return { msg: { ok: {} }, status: 200 }
        else return { msg: { err: 'Ошибка: Не получилось удалить запись' }, status: 500 }
    }

    async updateEntry(tableName, id, data) {
        const keys = Object.keys(data);
        const elems = Object.values(data);

        const params = keys.map((value, index) => `${value} = $${index + 2}${keys.length - 1 !== index ? ', ' : ''}`).join(' ');

        const answer = await DBManager.updateEntry(tableName, id, elems, params);
        if (answer[0])
            return { msg: { entry: answer }, status: 200 }
        else return { msg: { err: 'Ошибка: Не получилось обновить запись' }, status: 500 }
    }

    async insertEntry(tableName, data) {
        const keys = Object.keys(data);
        const elems = Object.values(data);

        const params = keys.join(', ');
        const nums = keys.map((value, index) => `$${index + 1}`).join(', ');
        
        const answer = await DBManager.insertEntry(tableName, elems, params, nums);
        if (answer[0])
            return { msg: { entry: answer }, status: 200 }
        else return { msg: { err: 'Ошибка: Не получилось удалить запись' }, status: 500 }
    }
}

module.exports = new TableManager();