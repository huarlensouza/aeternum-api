"use strict";Object.defineProperty(exports, "__esModule", {value: true});const { Client, GatewayIntentBits, Partials } = require('discord.js');

exports. default = {
    run: async() => {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions
            ],
            partials: [
                Partials.Message,
                Partials.GuildMember,
                Partials.Reaction,
                Partials.User,
        
            ]
        });
        
        client.on('ready', async() => {
            console.log(`O Aeternum bot foi iniciado com sucesso! - ${client.user.tag}!`);
        });
 
        client.login(process.env.ID_DISCORD_BOT);

        return client;
    }
};