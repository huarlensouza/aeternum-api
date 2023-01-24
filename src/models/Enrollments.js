import Database from "../lib/Database";
import Discord, { EmbedBuilder } from 'discord.js'

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
    update: async(data) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    UPDATE enrollments SET weapon_primary = (?), weapon_secondary = (?) WHERE id_discord = (?) AND id_championship = (SELECT id FROM championships WHERE active = 1)
                `, 
                [
                    data.weapon_primary,
                    data.weapon_secondary,
                    data.id_discord,
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
    getUser: async(id_discord) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query('SELECT id_register, weapon_primary, weapon_secondary FROM enrollments WHERE id_discord = (?) AND id_championship = (SELECT id FROM championships WHERE active = 1)', [id_discord], async(err, enrollment) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(enrollment[0] || false);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    hasEnrollment: async(id_discord) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query('SELECT id FROM enrollments WHERE id_discord = (?) AND id_championship = (SELECT id FROM championships WHERE active = 1)', [id_discord], async(err, enrollment) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(enrollment[0]?.id || false);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    setEnrollment: async(data) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    INSERT INTO enrollments (id_discord, id_championship, id_register, weapon_primary, weapon_secondary)
                    VALUES (?, (SELECT id FROM championships WHERE active = 1), ?, ?, ?)
                `, 
                [
                    data.id_discord,
                    data.id_register,
                    data.weapon_primary,
                    data.weapon_secondary,
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
    getChampion: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    SELECT
                        members.nickname,
                        members.id_discord,
                        members.avatar,
                        enrollments.weapon_primary,
                        enrollments.weapon_secondary,
                        championships.description,
                        championships.date
                    FROM members
                    INNER JOIN enrollments
                    ON members.id_discord = enrollments.id_discord
                    INNER JOIN championships
                    ON championships.id = enrollments.id_championship
                    WHERE enrollments.id_championship = (SELECT MAX(id_championship) FROM enrollments WHERE winner = 1) AND enrollments.winner = 1
                `, async(err, champion) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(champion);
                });
            } catch(e) {
                return reject(e);
            };
        });
    },
    delete: async(id_discord) => {
        return new Promise(async(resolve, reject) => {
            try {
                const webhookClient = new Discord.WebhookClient({url:process.env.URL_DISCORD_WEBHOOK});
                Database.query(`
                    SELECT id_register FROM enrollments
                    WHERE id_discord = (?) AND id_championship = (SELECT id FROM championships WHERE active = 1)
                `, [id_discord], async(err, enrollment) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    await webhookClient.deleteMessage(enrollment[0].id_register);

                    Database.query(`
                        DELETE FROM enrollments
                        WHERE id_discord = (?) AND id_championship = (SELECT id FROM championships WHERE active = 1)
                    `, [id_discord], async(err) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        };
    
                        return resolve(true);
                    });
                });
                
            } catch(e) {
                return reject(e);
            };
        });
    }
};