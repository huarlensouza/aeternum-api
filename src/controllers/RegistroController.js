import { validationResult } from 'express-validator';
import User from '../models/User';
import Championship from '../models/Championship';
import Enrollments from '../models/Enrollments';
import Weapons from '../models/Weapons';
import Token from '../jobs/token';
import Discord, { EmbedBuilder } from 'discord.js'

export default {
    create: async(request, response) => {
        try {
            const { nickname, id_discord, email, weapon_primary, weapon_secondary, hour, days, access_token, refresh_token, avatar } = request.body;
            
            const month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            
            const errors = validationResult(request);
            if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });

            //JSON com as informações do Usuário
            const user_discord = await (
                await fetch("https://discord.com/api/users/@me", {
                    headers: {
                        authorization: `Bearer ${Token.decrypt(access_token)}`,
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
                    access_token: Token.decrypt(access_token),
                    nick: nickname,
                    roles: [Weapons.getId(weapon_primary), Weapons.getId(weapon_secondary), process.env.ID_DISCORD_ROLE_MEMBER]
                })
            });
    
            await fetch(`https://discord.com/api/guilds/${process.env.ID_DISCORD_SERVER}/members/${id_discord}`, {
                method:'PATCH',
                headers: {
                    "Authorization": `Bot ${process.env.ID_DISCORD_BOT}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    access_token: Token.decrypt(access_token),
                    nick: nickname,
                    roles: [Weapons.getId(weapon_primary), Weapons.getId(weapon_secondary), process.env.ID_DISCORD_ROLE_MEMBER]
                })
            });

            const isUser = await User.isUser(id_discord);
            if(isUser) {
                await User.updateUser({
                    nickname: nickname.trim(),
                    email: email,
                    days: days.join(', '),
                    hour: hour,
                    id_discord: id_discord,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    avatar: avatar
                });
            } else {
                await User.setUser({
                    nickname: nickname.trim(),
                    email: email,
                    days: days.join(', '),
                    hour: hour,
                    id_discord: id_discord,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    avatar: avatar
                });
            };

            const championship = await Championship.getOpen();

            if(championship.register == 0) return response.status(200).send({enrollment:false, message:"O prazo para inscrição foi encerrada."}); 
            if(!championship) return response.status(200).send({enrollment:false, message:"O campeonato foi encerrado, aguarde o próximo evento."}); 

            const infoChampionship = {
                day: ('00'+new Date(championship.date).getDate()).slice(-2),
                month: month[new Date(championship.date).getMonth()],
                year: new Date(championship.date).getUTCFullYear(),
                hours: `${new Date(championship.date).getHours()}:${('00'+new Date(championship.date).getMinutes()).slice(-2)}`
            }

            const webhookClient = new Discord.WebhookClient({url:process.env.URL_DISCORD_WEBHOOK});
            const embed = new EmbedBuilder()
            .setAuthor({name:nickname, iconURL: `https://cdn.discordapp.com/avatars/${id_discord}/${avatar}`})
            .setColor(0xEDA73E)
            .addFields(
                { name: `Campeonato - ${championship.description}`, value: `${infoChampionship.day} de ${infoChampionship.month} de ${infoChampionship.year} às ${infoChampionship.hours}` },
                { name: 'Arma primária', value: weapon_primary, inline: true },
                { name: 'Arma secundária', value: weapon_secondary, inline: true },
            )
            .setTimestamp()
            
            const message = await webhookClient.send({
                username: `Competidor: `,
                content: `<@${id_discord}>`,
                embeds: [embed],
            })

            const hasEnrollment = await Enrollments.hasEnrollment(id_discord);
            if(!hasEnrollment) {
                await Enrollments.setEnrollment({
                    id_discord: id_discord,
                    weapon_primary: weapon_primary,
                    weapon_secondary: weapon_secondary,
                    id_register: message.id
                });
            };
           
            return response.status(200).send({enrollment:true});
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        };
    },
    update: async(request, response) => { 
        try {
            const month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

            const { nickname, id_discord, id_register, weapon_primary, weapon_secondary, avatar, access_token } = request.body;

            await fetch(`https://discord.com/api/guilds/${process.env.ID_DISCORD_SERVER}/members/${id_discord}`, {
                method:'PATCH',
                headers: {
                    "Authorization": `Bot ${process.env.ID_DISCORD_BOT}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    access_token: Token.decrypt(access_token),
                    nick: nickname,
                    roles: [Weapons.getId(weapon_primary), Weapons.getId(weapon_secondary), process.env.ID_DISCORD_ROLE_MEMBER]
                })
            });

            const championship = await Championship.getOpen();
            const championship_date = new Date(championship.date)
            const championship_day = ('00'+championship_date.getDate()).slice(-2);
            const championship_month = month[championship_date.getMonth()];
            const championship_year = championship_date.getUTCFullYear();
            const championship_hours = `${championship_date.getHours()}:${('00'+championship_date.getMinutes()).slice(-2)}`;

            const webhookClient = new Discord.WebhookClient({url:process.env.URL_DISCORD_WEBHOOK});
            const embed = new EmbedBuilder()
            .setAuthor({name:nickname, iconURL: `https://cdn.discordapp.com/avatars/${id_discord}/${avatar}`})
            .setColor(0xEDA73E)
            .addFields(
                { name: `Campeonato - ${championship.description}`, value: `${championship_day} de ${championship_month} de ${championship_year} às ${championship_hours}` },
                { name: 'Arma primária', value: weapon_primary, inline: true },
                { name: 'Arma secundária', value: weapon_secondary, inline: true },
            )
            .setTimestamp()
            
            await webhookClient.editMessage(id_register, {
                username: `Competidor: `,
                content: `<@${id_discord}> (Alterou os equipamentos)`,
                embeds: [embed],
            })
            
            const updated = await Enrollments.update(request.body)

            return response.status(200).send({updated:updated});
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        };
    },
    delete: async(request, response) => {
        try {
            const { id_discord, access_token } = request.body;
            const userToken = await User.getUserToken(id_discord);
    
            if(userToken == access_token) {
                await Enrollments.delete(id_discord);
            }

            return response.status(200).send(true);
        } catch(e) {
            console.log(e);
            return response.status(500).send(false);
        }
    }
};