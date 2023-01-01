import { validationResult } from 'express-validator';
import User from '../models/User';
import Championship from '../models/Championship';
import Enrollments from '../models/Enrollments';
import token from '../jobs/token';

export default {
    create: async(request, response) => {
        try {
            const { nickname, id_discord, email, weapon_primary, weapon_secondary, hour, days, access_token } = request.body;
            console.log(nickname, id_discord, email, weapon_primary, weapon_secondary, hour, days, access_token)

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            };

            //JSON com as informações do Usuário
            const user_discord = await (
                await fetch("https://discord.com/api/users/@me", {
                    headers: {
                        authorization: `Bearer ${token.decrypt(access_token)}`,
                    },
                })
            ).json();

            if(user_discord.message == '401: Unauthorized') return response.status(200).send({enrollment:false});
            if(user_discord.id != id_discord || user_discord.email != email) return response.status(200).send({enrollment:false});

            //Adiciona no Discord
            await fetch(`https://discord.com/api/guilds/${process.env.ID_DISCORD_SERVER}/members/${id_discord}`, {
                method:'PUT',
                headers: {
                    "Authorization": `Bot ${process.env.ID_DISCORD_BOT}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    access_token: token.decrypt(access_token),
                    nick: nickname
                })
            });
    
            //Adiciona cargo
            await fetch(`https://discord.com/api/guilds/${process.env.ID_DISCORD_SERVER}/members/${id_discord}/roles/${process.env.ID_DISCORD_ROLE_MEMBER}`, {
                method:'PUT',
                headers: {
                    "Authorization": `Bot ${process.env.ID_DISCORD_BOT}`,
                    "Content-Type": "application/json"
                }
            });

            const user = await User.isUser(id_discord, email);
            if(user) {
                await User.setUser({
                    nickname: nickname,
                    email: email,
                    days: days.join(', '),
                    hour: hour,
                    id_discord: id_discord,
                    access_token: access_token
                });
            } else {
                await User.updateUser({
                    nickname: nickname,
                    email: email,
                    days: days.join(', '),
                    hour: hour,
                    id_discord: id_discord,
                    access_token: access_token
                })
            }

            const id_championship = await Championship.getId();
            const register_championship = await Enrollments.getRegister(id_discord, id_championship);
            if(register_championship) {
                await Enrollments.setRegister({
                    id_discord: id_discord,
                    id_championship: id_championship,
                    weapon_primary: weapon_primary,
                    weapon_secondary: weapon_secondary
                });
            };

            return response.status(200).send({enrollment:true});
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        };
    }
};