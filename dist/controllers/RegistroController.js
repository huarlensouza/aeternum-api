"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _expressvalidator = require('express-validator');
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Championship = require('../models/Championship'); var _Championship2 = _interopRequireDefault(_Championship);
var _Enrollments = require('../models/Enrollments'); var _Enrollments2 = _interopRequireDefault(_Enrollments);
var _token = require('../jobs/token'); var _token2 = _interopRequireDefault(_token);
var _discordjs = require('discord.js'); var _discordjs2 = _interopRequireDefault(_discordjs);

exports. default = {
    create: async(request, response) => {
        try {
            const month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

            const { nickname, id_discord, email, weapon_primary, weapon_secondary, hour, days, access_token, avatar } = request.body;

            const errors = _expressvalidator.validationResult.call(void 0, request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            };

            //JSON com as informações do Usuário
            const user_discord = await (
                await fetch("https://discord.com/api/users/@me", {
                    headers: {
                        authorization: `Bearer ${_token2.default.decrypt(access_token)}`,
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
                    access_token: _token2.default.decrypt(access_token),
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

            const user = await _User2.default.isUser(id_discord, email);
            if(user) {
                await _User2.default.setUser({
                    nickname: nickname,
                    email: email,
                    days: days.join(', '),
                    hour: hour,
                    id_discord: id_discord,
                    access_token: access_token
                });
            } else {
                await _User2.default.updateUser({
                    nickname: nickname,
                    email: email,
                    days: days.join(', '),
                    hour: hour,
                    id_discord: id_discord,
                    access_token: access_token
                });
            };

            const id_championship = await _Championship2.default.getId();
            const register_championship = await _Enrollments2.default.getRegister(id_discord, id_championship);
            if(register_championship) {
                await _Enrollments2.default.setRegister({
                    id_discord: id_discord,
                    id_championship: id_championship,
                    weapon_primary: weapon_primary,
                    weapon_secondary: weapon_secondary
                });
            };

            const championship = await _Championship2.default.getOpen();
            const championship_date = new Date(championship.date)
            const championship_day = ('00'+championship_date.getDate()).slice(-2);
            const championship_month = month[championship_date.getMonth()];
            const championship_year = championship_date.getUTCFullYear();
            const championship_hours = `${championship_date.getHours()}:${('00'+championship_date.getMinutes()).slice(-2)}`;

            const weebhookClient = new _discordjs2.default.WebhookClient({url:process.env.URL_DISCORD_WEBHOOK});
            const embed = new (0, _discordjs.EmbedBuilder)()
            .setAuthor({name:nickname, iconURL: `https://cdn.discordapp.com/avatars/${id_discord}/${avatar}`})
            .setColor(0xEDA73E)
            .addFields(
                { name: `Campeonato - ${championship.description}`, value: `${championship_day} de ${championship_month} de ${championship_year} às ${championship_hours}` },
                { name: 'Arma primária', value: weapon_primary, inline: true },
                { name: 'Arma secundária', value: weapon_secondary, inline: true },
            )
            .setTimestamp()
            
            weebhookClient.send({
                username: `Competidor: `,
                content: `<@${id_discord}>`,
                embeds: [embed],
            })

            return response.status(200).send({enrollment:true});
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        };
    }
};