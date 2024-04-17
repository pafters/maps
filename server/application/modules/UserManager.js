const DBManager = require('./db/DBManager');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

class UserManager {

    auth = async (login, password) => {
        if (login) {
            if (password) {
                try {
                    const user = await DBManager.getUserByLogin(login);
                    if (user) {
                        const result = await bcrypt.compare(`${password}`, `${user.password}`);
                        if (result) {
                            const payload = {
                                login,
                                password
                            }
                            const token = jwt.sign(payload, process.env.JWT_SECRET);
                            return { msg: { token }, status: 200 };
                        }
                        else return { msg: { err: 'Ошибка: Неправильный пароль' }, status: 400 };
                    } else return { msg: { err: 'Ошибка: Пользователь не найден' }, status: 400 };
                } catch (e) {
                    console.log(e);
                    return { msg: { err: 'Ошибка: Сервер не смог обработать запрос' }, status: 500 };
                }
            } else return { msg: { err: 'Ошибка: Заполните поле "Пароль"' }, status: 400 };
        } else return { msg: { err: 'Ошибка: Заполните поле "Логин"' }, status: 400 };
    }

    insertUser = async (login, password) => {
        if (login) {
            if (password) {
                try {
                    const user = await DBManager.getUserByLogin(login);
                    if (user) return { msg: { err: 'Ошибка: Пользователь уже существует' }, status: 400 }
                    else {
                        const hashPassword = await bcrypt.hash(`${password}`, 8);
                        const insertUserInfo = await DBManager.insertUser(login, hashPassword);
                        if (insertUserInfo)
                            return { msg: { ok: {} }, status: 200 }
                    }
                } catch (e) {
                    console.log(e);
                    return { msg: { err: 'Ошибка: Сервер не смог обработать запрос' }, status: 500 }
                }
            } else return { msg: { err: 'Ошибка: Заполните поле "Пароль"' }, status: 400 }
        } else return { msg: { err: 'Ошибка: Заполните поле "Логин"' }, status: 400 }
    }

    decodeToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return false;
        }
    }

    getMe = async (token) => {
        try {
            const userInfo = this.decodeToken(token)
            const user = await DBManager.getUserByLogin(userInfo.login);
            if (user) {
                const result = await bcrypt.compare(`${userInfo.password}`, `${user.password}`);
                if (result) {
                    return { msg: {}, status: 200 }
                } else return { msg: { err: 'Ошибка: Неправильный пароль' }, status: 400 };
            } else return { msg: { err: 'Ошибка: Пользователь не найден' }, status: 400 };
        } catch (e) {
            return { msg: { err: 'Ошибка: Сервер не смог обработать запрос' }, status: 500 }
        }

    }
}

module.exports = new UserManager();