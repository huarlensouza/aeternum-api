"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Database = require('../lib/Database'); var _Database2 = _interopRequireDefault(_Database);

exports. default = {
    getUser: async(id_discord, email) => {
        return new Promise((resolve, reject) => {
            try {
                _Database2.default.query('SELECT nickname, email, days, hours, id_discord, verified FROM members WHERE id_discord = (?) AND email = (?)', [id_discord, email], async(err, user) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(user);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    setUser: async(data) => {
        return new Promise(async(resolve, reject) => {
            try {
                _Database2.default.query(`
                    INSERT INTO members (nickname, email, days, hours, id_discord, access_token)
                    VALUES (?)
                `, [
                        [
                            data.nickname,
                            data.email,
                            data.days,
                            data.hour,
                            data.id_discord,
                            data.access_token
                        ]
                    ], async(err) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(true);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    isUser: async(id_discord, email) => {
        return new Promise((resolve, reject) => {
            try {
                _Database2.default.query('SELECT COUNT(id) AS "boolean" FROM members WHERE id_discord = (?) AND email = (?)', [id_discord, email], async(err, user) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(user[0].boolean > 0 ? false : true);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    updateUser: async(data) => {
        return new Promise(async(resolve, reject) => {
            try {
                _Database2.default.query(`
                    UPDATE members SET nickname = (?), days = (?), hours = (?), access_token = (?), updated_at = NOW()
                    WHERE id_discord = (?) AND email = (?)
                `, [
                        
                        data.nickname,
                        data.days,
                        data.hour,
                        data.access_token,
                        data.id_discord,
                        data.email
                    
                    ], async(err) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(true);
                });
            } catch(e) {
                return reject(e);
            };
        });
    }
};