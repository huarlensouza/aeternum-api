const { Client, GatewayIntentBits, Partials } = require('discord.js');

import Championship from '../models/Championship'
import Enrollments from '../models/Enrollments';

export default {
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

        client.on('guildMemberRemove', async(member) => {
            const championship = await Championship.getId();
            if(championship) {
                await Enrollments.delete(member.user.id);
            };
        
            const channel = client.channels.cache.get('1063947151215956069');
            channel.send(`O competidor ${member.nickname || member.user.username} - <@${member.user.id}> saiu do Discord`);
        });
 
        client.login(process.env.ID_DISCORD_BOT);
    }
};