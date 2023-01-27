import Database from "../lib/Database";

export default {
    getDuels: async(id_championship) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    SELECT
                        championships.description AS championship,
                        members.nickname,
                        members.id_discord,
                        members.avatar,
                        (SELECT weapon_primary FROM enrollments WHERE id_discord = members.id_discord AND id_championship = championships.id) AS weapon_primary,
                        (SELECT weapon_secondary FROM enrollments WHERE id_discord = members.id_discord AND id_championship = championships.id) AS weapon_secondary,
                        (SELECT nickname FROM members WHERE id_discord = duels.id_discord_opponent) AS opponent,
                        duels.id_discord_opponent,
                        (SELECT avatar FROM members WHERE id_discord = duels.id_discord_opponent) AS avatar_opponent,
                        (SELECT weapon_primary FROM enrollments WHERE id_discord = duels.id_discord_opponent AND id_championship = championships.id) AS weapon_primary_opponent,
                        (SELECT weapon_secondary FROM enrollments WHERE id_discord = duels.id_discord_opponent AND id_championship = championships.id) AS weapon_secondary_opponent,
                        duels.kills,
                        duels.deaths,
                        duels.round,
                        duels.winner,
                        duels.link
                    FROM members
                    INNER JOIN duels
                    ON members.id_discord = duels.id_discord
                    INNER JOIN championships
                    ON duels.id_championship = championships.id
                    WHERE duels.id_championship = (?) AND winner = 1
                    ORDER BY duels.round ASC
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
    getRanking: async() => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    SELECT
                        tp.nickname,
                        tp.id_discord,
                        tp.kills,
                        tp.deaths,
                        tp.wins,
                        tp.losses,
                        CASE
                            WHEN SUM(enr.winner) > 0 THEN SUM(enr.winner)
                            ELSE 0
                        END AS champions
                    FROM (
                        SELECT
                            mb.id_discord,
                            mb.nickname,
                            sum(dl.kills) AS kills,
                            sum(dl.deaths) AS deaths,
                            sum(dl.winner) as wins,
                            count(*)-sum(dl.winner) AS losses
                        FROM members AS mb
                        INNER JOIN duels AS dl
                        ON mb.id_discord = dl.id_discord
                        GROUP BY mb.id_discord, mb.nickname
                        ORDER BY wins DESC, kills DESC
                    ) AS tp
                    LEFT JOIN enrollments AS enr
                    ON tp.id_discord = enr.id_discord
                    GROUP BY tp.id_discord, tp.nickname, tp.kills, tp.deaths, tp.wins, tp.losses, enr.id_discord
                    ORDER BY champions DESC, wins DESC, kills DESC
                `, async(err, enrollment) => {
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
    getRankingIndividual: async(id_discord) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.query(`
                    SELECT
                        championships.description AS championship,
                        members.nickname,
                        members.id_discord,
                        members.avatar,
                        (SELECT weapon_primary FROM enrollments WHERE id_discord = members.id_discord AND id_championship = championships.id) AS weapon_primary,
                        (SELECT weapon_secondary FROM enrollments WHERE id_discord = members.id_discord AND id_championship = championships.id) AS weapon_secondary,
                        (SELECT nickname FROM members WHERE id_discord = duels.id_discord_opponent) AS opponent,
                        duels.id_discord_opponent,
                        (SELECT avatar FROM members WHERE id_discord = duels.id_discord_opponent) AS avatar_opponent,
                        (SELECT weapon_primary FROM enrollments WHERE id_discord = duels.id_discord_opponent AND id_championship = championships.id) AS weapon_primary_opponent,
                        (SELECT weapon_secondary FROM enrollments WHERE id_discord = duels.id_discord_opponent AND id_championship = championships.id) AS weapon_secondary_opponent,
                        duels.kills,
                        duels.deaths,
                        duels.round,
                        duels.winner,
                        duels.link
                    FROM members
                    INNER JOIN duels
                    ON members.id_discord = duels.id_discord
                    INNER JOIN championships
                    ON duels.id_championship = championships.id
                    WHERE members.id_discord = (?)
                `, [id_discord], async(err, data) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    };

                    return resolve(data);
                });
            } catch(e) {
                return reject(e);
            };
        });
    }
}