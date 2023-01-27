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
                        description,
                        register,
                        active,
                        value,
                        date,
                        (SELECT nickname FROM members WHERE id_discord = enrollments.id_discord) AS nickname,
                        id_discord,
                        weapon_primary,
                        weapon_secondary,
                        (SELECT avatar FROM members WHERE id_discord = enrollments.id_discord) AS avatar,
                        link
                    FROM championships
                    LEFT JOIN enrollments
                    ON championships.id = enrollments.id_championship
                    WHERE enrollments.winner = 1 OR enrollments.winner IS NULL
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