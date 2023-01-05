import Database from "../lib/Database";

export default {
    get: async(id_championship) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    SELECT 
                        members.nickname, members.email, members.verified, members.id_discord, enrollments.weapon_primary, enrollments.weapon_secondary,
                        CASE
                            WHEN duels.id_discord_primary = members.id_discord THEN (SELECT nickname FROM members WHERE id_discord = duels.id_discord_secondary)
                            WHEN duels.id_discord_secondary = members.id_discord THEN (SELECT nickname FROM members WHERE id_discord = duels.id_discord_primary)
                            END AS 'opponent'
                    FROM enrollments 
                        INNER JOIN members
                        ON enrollments.id_discord = members.id_discord
                        INNER JOIN duels
                        ON enrollments.id_discord = duels.id_discord_primary OR enrollments.id_discord = duels.id_discord_secondary
                    WHERE
                        enrollments.participation = 1 AND
                        enrollments.id_championship = (2)
                `, [id_championship], async(err, enrollment) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(enrollment);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    getRegister: async(id_discord, id_championship) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query('SELECT COUNT(id) AS "boolean" FROM enrollments WHERE id_discord = (?) AND id_championship = (?)', [id_discord, id_championship], async(err, enrollment) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(enrollment[0].boolean > 0 ? false : true);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    setRegister: async(data) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    INSERT INTO enrollments (id_discord, id_championship, weapon_primary, weapon_secondary)
                    VALUES (?)
                `, [
                        [
                            data.id_discord,
                            data.id_championship,
                            data.weapon_primary,
                            data.weapon_secondary,
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
    }
}