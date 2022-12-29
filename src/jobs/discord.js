const { Client, GatewayIntentBits, Partials } = require('discord.js');

export default {
    run: () => {
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
        
        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);
        });
        
        // client.on('guildMemberAdd', response => {
        //     response.roles.add(process.env.ID_ROLE)
        // });
        
        client.login('MTA1Njc1OTE2MDk1NzU2NzA3Nw.GVIYjh.QzRXuao9ZcR_HjGaU5K8YELDZyLLzmdT1Z9ORU');
    }
}