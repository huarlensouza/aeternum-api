import Database from '../lib/Database';

export default {
    getOpen: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query('SELECT id, description, register, active, weapon, date, value FROM championships WHERE active = 1', async(err, championship) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(championship[0] || false);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    getId: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query('SELECT id FROM championships WHERE active = 1', async(err, championship) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };
                    return resolve(championship.length > 0 ? championship[0].id : false);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    isOpen: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query('SELECT COUNT(id) AS "boolean" FROM championships WHERE register = 1 AND active = 1', async(err, championship) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };
                    return resolve(championship[0].boolean > 0 ? true : false);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    getAll: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    SELECT
                        championships.id,
                        championships.description,
                        championships.register,
                        championships.active,
                        championships.value,
                        championships.date,
                        (SELECT id_discord FROM enrollments WHERE winner = 1 AND id_championship = championships.id) AS id_discord_champion,
                        (SELECT nickname FROM members WHERE members.id_discord = id_discord_champion) AS nickname,
                        (SELECT weapon_primary FROM enrollments WHERE winner = 1 AND id_championship = championships.id) AS weapon_primary,
                        (SELECT weapon_secondary FROM enrollments WHERE winner = 1 AND id_championship = championships.id) AS weapon_secondary,
                        championships.link
                    FROM championships
                    ORDER BY championships.id DESC
                `, async(err, championships) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };
                    return resolve(championships);
                });
            } catch(e) {
                return reject(e);
            };
        });
    }
};