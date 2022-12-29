import { body, validationResult } from 'express-validator';
import Database from "../lib/Database";

export default {
    create: async(req, res) => {
        return new Promise(async(resolve, reject) => {
            try {
                Database.connect(async err => {
                    if (err) throw err;
    
                    const { nickname, id, email, weapon_primary, weapon_secondary, hour, days, access_token } = req.body;
           
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json({ errors: errors.array() });
                    }
            
                    const data = JSON.stringify({
                        access_token: access_token,
                        nick: nickname
                    })
            
                    //Adiciona no Discord
                    await fetch(`https://discord.com/api/guilds/${process.env.ID_SERVER}/members/${id}`, {
                        method:'PUT',
                        headers: {
                            "Authorization": `Bot ${process.env.ID_BOT}`,
                            "Content-Type": "application/json"
                        },
                        body: data
                    });
            
                    //Adiciona cargo
                    await fetch(`https://discord.com/api/guilds/${process.env.ID_SERVER}/members/${id}/roles/${process.env.ID_ROLE_MEMBER}`, {
                        method:'PUT',
                        headers: {
                            "Authorization": `Bot ${process.env.ID_BOT}`,
                            "Content-Type": "application/json"
                        },
                        body: data
                    });

                    Database.query(`SELECT id FROM aeternum.campeonato WHERE ativo = 1`, async(err, result) => {
                        if (err) throw err;
                        Database.query(`
                            INSERT INTO aeternum.cadastro (nickname, email, weapon_primary, weapon_secondary, days, hours, id_championship, id_discord)
                            VALUES (?)
                        `, [[nickname, email, weapon_primary, weapon_secondary, days.join(', '), hour, result[0].id, id]], async(err, registro) => {
                            if (err) throw err;
                            return res.status(200).json({register:true})
                        });
                    });

                   
        
                });
            } catch(e) {
                return reject(e);
            };
        });


    },
}