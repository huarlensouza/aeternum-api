import Database from '../lib/Database';

export default {
    isUser: async(id_discord, email) => {
        return new Promise((resolve, reject) => {
            try {
                Database.query('SELECT id FROM members WHERE id_discord = (?)', [id_discord], async(err, user) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(user[0]?.id || false);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    getUser: async(id_discord) => {
        return new Promise((resolve, reject) => {
            try {
                Database.query('SELECT nickname, email, days, hours, id_discord, verified FROM members WHERE id_discord = (?)', [id_discord], async(err, user) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(user[0] || false);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    setUser: async(data) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    INSERT INTO members (nickname, email, days, hours, id_discord, access_token, refresh_token, avatar)
                    VALUES (?)
                `, [
                        [
                            data.nickname,
                            data.email,
                            data.days,
                            data.hour,
                            data.id_discord,
                            data.access_token,
                            data.refresh_token,
                            data.avatar
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
    updateUser: async(data) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    UPDATE members SET nickname = (?), days = (?), hours = (?), access_token = (?), avatar = (?), refresh_token = (?), updated_at = NOW()
                    WHERE id_discord = (?) AND email = (?)
                `, [
                        
                        data.nickname,
                        data.days,
                        data.hour,
                        data.access_token,
                        data.avatar,
                        data.refresh_token,
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
    },
    getUserToken: async(id_discord) => {
        return new Promise((resolve, reject) => {
            try {
                Database.query('SELECT access_token FROM members WHERE id_discord = (?)', [id_discord], async(err, user) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(user[0].access_token);
                });
            } catch(e) {
                return reject(e);
            };
        }); 
    }
};