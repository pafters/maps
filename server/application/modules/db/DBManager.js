const pool = require("./DB");

class DBManager {

    async getVersion() {
        pool.query('SELECT version()', (err, res) => {
            console.log(err, res);
        });
    }

    async dbQuery(query, values = []) {
        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async dbQueryAll(query, values = []) {
        try {
            const res = await pool.query(query, values);
            return res.rows;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    getToken = async (token) => {
        const query = 'SELECT id, token FROM scenes WHERE token = $1';
        const values = [`${token}`]
        const answer = await this.dbQuery(query, values);
        return answer
    }

    insertToken = async (token) => {
        const query = 'INSERT INTO scenes (token) VALUES($1) RETURNING *'
        const values = [`${token}`]

        const answer = await this.dbQuery(query, values)
        return answer
    }

    insertPhoto = async (filename, { x, y, zoom }) => {
        const query = 'INSERT INTO photos (name, x, y, zoom) VALUES($1, $2, $3, $4) RETURNING *'
        const values = [`${filename}`, x, y, zoom];
        const answer = await this.dbQuery(query, values);

        return answer
    }

    insertMessage = async (message) => {
        const query = 'INSERT INTO comments (message) VALUES($1) RETURNING *'
        const values = [message ? `${message}` : null];
        const answer = await this.dbQuery(query, values);;
        return answer
    }

    insertPlayer = async (sceneId, photoId, messageId, position, createdAt) => {
        const query = 'INSERT INTO players (scene_id, photo_id, comment_id, position, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *'
        const values = [sceneId, photoId, messageId, position, createdAt];
        const answer = await this.dbQuery(query, values);

        return answer
    }

    getPlayersByToken = async (token) => {
        const query = `SELECT 
        players.id, players.position, players.created_at,
        comments.message, 
        photos.name, photos.x, photos.y, photos.zoom
        FROM players 
        JOIN scenes ON players.scene_id = scenes.id
        LEFT JOIN comments ON players.comment_id = comments.id
        LEFT JOIN photos ON players.photo_id = photos.id
        WHERE scenes.token = $1`;
        const values = [token];
        const answer = await this.dbQueryAll(query, values);
        return answer;
    }

    getOldFiles = async () => {
        const query = `SELECT 
        players.id, photos.name
        FROM players
        JOIN photos ON players.photo_id = photos.id
        WHERE players.created_at < NOW() - INTERVAL '2 weeks';`;
        const answer = await this.dbQueryAll(query);
        return answer;
    }

    deleteOldScenes = async () => {
        const query = `DELETE FROM players
        WHERE id IN (
            SELECT id
            FROM players
            WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '2 weeks'
        );
        
        DELETE FROM scenes 
        WHERE id NOT IN (SELECT scene_id FROM players);

        DELETE FROM comments 
        WHERE id NOT IN (SELECT comment_id FROM players);
        
        DELETE FROM photos 
        WHERE id NOT IN (SELECT photo_id FROM players);
        `;
        const answer = await this.dbQueryAll(query);
        return answer;
    }

    /*********************************/
    /********* USERS *****************/
    /*********************************/

    getUserByLogin = async (login) => {
        const query = 'SELECT login, password FROM users WHERE login = $1'
        const values = [login];
        const answer = await this.dbQuery(query, values);
        return answer
    }

    getUserById = async (id) => {
        const query = 'SELECT login, password FROM users WHERE id = $1'
        const values = [id];
        const answer = await this.dbQuery(query, values);
        return answer
    }

    insertUser = async (login, password) => {
        const query = 'INSERT INTO users (login, password) VALUES($1, $2) RETURNING *'
        const values = [login, password];
        const answer = await this.dbQuery(query, values);

        return answer
    }

    insertTour = async (name, price, description) => {
        const query = 'INSERT INTO tours (name, price, description) VALUES($1, $2, $3) RETURNING *'
        const values = [login, password];
        const answer = await this.dbQuery(query, values);

        return answer
    }

    getTable = async (tableName, limit, offset) => {
        const query = `SELECT * FROM ${tableName} LIMIT $1 OFFSET $2`;
        const values = [limit, offset];

        const answer = await this.dbQueryAll(query, values);

        return answer
    }

    deleteEntry = async (tableName, id) => {
        const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
        const values = [id];

        const answer = await this.dbQueryAll(query, values);

        return answer
    }

    updateEntry = async (tableName, id, elems, params) => {
        const query = `UPDATE ${tableName} SET ${params} WHERE id = $1 RETURNING *`;
        const values = [id, ...elems];

        const answer = await this.dbQueryAll(query, values);

        return answer
    }

    insertEntry = async (tableName, elems, params, nums) => {
        const query = `INSERT INTO ${tableName} (${params}) VALUES (${nums}) RETURNING *`;
        const values = [...elems];

        const answer = await this.dbQueryAll(query, values);

        return answer
    }

    getTourByUrl = async (url) => {
        const query = `SELECT id, name, price, region, city, description FROM tours WHERE url = $1`;
        const values = [url];
        const answer = await this.dbQuery(query, values);

        return answer;
    }

    getTourIdByUrl = async (url) => {
        const query = `SELECT id FROM tours WHERE url = $1`;
        const values = [url];
        const answer = await this.dbQuery(query, values);

        return answer;
    }

    getPhotoByTour = async (tourId, index) => {
        const query = `SELECT id FROM photos WHERE tour_id = $1 AND index = $2`;
        const values = [tourId, index];
        const answer = await this.dbQuery(query, values);

        return answer;
    }

    getAvatarByTour = async (tourId) => {
        const query = `SELECT id, path FROM avatars WHERE tour_id = $1`;
        const values = [tourId];
        const answer = await this.dbQuery(query, values);

        return answer;
    }

    getPhotosByTour = async (tourId) => {
        const query = `SELECT id, path, index FROM photos WHERE tour_id = $1`;
        const values = [tourId];
        const answer = await this.dbQueryAll(query, values);

        return answer;
    }

    deleteAllEntryByTourId = async (tableName, tourId) => {
        const query = `DELETE FROM ${tableName} WHERE tour_id = $1;`;
        const values = [tourId];
        const answer = await this.dbQueryAll(query, values);

        return answer;
    }

    getRegions = async () => {
        const query = `SELECT DISTINCT region FROM tours`;
        const values = [];
        const answer = await this.dbQueryAll(query, values);

        return answer;
    }

    getCitiesByRegion = async (region) => {
        const query = `SELECT DISTINCT city FROM tours WHERE region = $1`;
        const values = [region];
        const answer = await this.dbQueryAll(query, values);
        return answer;
    }

    getCities = async () => {
        const query = `SELECT DISTINCT city FROM tours`;
        const values = [];
        const answer = await this.dbQueryAll(query, values);
        return answer;
    }

    getToursByCity = async (city) => {
        const query = `SELECT tours.id, tours.name, tours.price, tours.url, avatars.path 
        FROM tours
        LEFT JOIN avatars ON tours.id = avatars.tour_id
        WHERE tours.city = $1;`;
        const values = [city];
        const answer = await this.dbQueryAll(query, values);

        return answer;
    }

    deletePhoto = async (path) => {
        const query = `WITH deleted AS (
            DELETE FROM photos
            WHERE path = $1
            RETURNING index, tour_id
        ), updated AS (
        UPDATE photos
        SET index = index-1
        WHERE tour_id = (SELECT tour_id FROM deleted) AND index > (SELECT index FROM deleted)) SELECT tour_id FROM deleted;`;

        const values = [path];
        const answer = await this.dbQuery(query, values);
        return answer;
    }

    deleteAvatar = async (path) => {
        const query = `DELETE FROM avatars
        WHERE path = $1
        RETURNING tour_id`;
        const values = [path];
        const answer = await this.dbQuery(query, values);
        return answer;
    }
}

module.exports = new DBManager();