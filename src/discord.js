require("dotenv").config(); // Abilita a leitura das variaveis locais no projeto

const express = require("express"); // Exporta a dependência do express para a criação do servidor
const fetch = require("node-fetch"); // Exporta a dependência do node-fetch para solcitações para a API
const FormData = require("form-data"); // Gerador de formulário para Body para solicitações na API

import FormData from 'form-data'

const { Client, GatewayIntentBits, Partials } = require('discord.js');

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

client.on('guildMemberAdd', response => {
    response.roles.add(process.env.ID_ROLE)
});

client.login('MTA1Njc1OTE2MDk1NzU2NzA3Nw.GVIYjh.QzRXuao9ZcR_HjGaU5K8YELDZyLLzmdT1Z9ORU');

const app = express(); // Inicia a função de aplicativo padrão do express
const port = process.env.PORT || 3000; // Faz a busca da porta do servidor no arquivo ENV
const config = require("../src/config/discord.json"); // Exporta o arquivo de configurações

app.use(require("express-session")({
    secret: "aeternumsecret",
    cookie: {
        maxAge: 86400000,
    }, 
    resave: true,
    saveUninitialized: false
}));

app.get('/', async (request, response) => {
    if (!request.session.bearer_token) {
        response.status(200).json({auth:false})
    } else {
        response.status(200).json({
            auth:true,
            user: request.session.user_info,
            user_token: request.session.user_token
        });
    };
});

app.get("/auth/discord", (request, response) => {
    response.redirect(`https://discord.com/api/oauth2/authorize` + 
        `?client_id=${config.oauth2.client_id}` +
        `&redirect_uri=${encodeURIComponent(config.oauth2.redirect_uri)}` +
        `&response_type=code&scope=${encodeURIComponent(config.oauth2.scopes.join(" "))}`
    );
});

app.get("/auth/discord/callback", async (request, response) => {
    const accessCode = request.query.code;
    if (!accessCode) return response.redirect("/");

    const data = new FormData();
    data.append("client_id", config.oauth2.client_id);
    data.append("client_secret", process.env.CLIENT_SECRET);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", config.oauth2.redirect_uri);
    data.append("scope", config.oauth2.scopes.join(' '));
    data.append("code", accessCode);

    const json = await (
        await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: data
        })
    ).json();

    console.log(json)

    const userJson = await (
        await fetch("https://discord.com/api/users/@me", {
            headers: {
                authorization: `${json.token_type} ${json.access_token}`,
            },
        })
    ).json();

    const guildJson = await (
        await fetch("https://discord.com/api/users/@me/guilds", {
            headers: {
                authorization: `${json.token_type} ${json.access_token}`,
            },
            
        })
    ).json();

    const test = JSON.stringify({
        access_token: json.access_token,
        nick: "Huaaaaaaaaaaaa"
    })

    await fetch("https://discord.com/api/guilds/899418808408768512/members/587052973637763073", {
        method:'PUT',
        headers: {
            "Authorization": `Bot MTA1Njc1OTE2MDk1NzU2NzA3Nw.GVIYjh.QzRXuao9ZcR_HjGaU5K8YELDZyLLzmdT1Z9ORU`,
            "Content-Type": "application/json"
        },
        body: test
    });

    request.session.user_info = userJson;
    request.session.user_token = Math.floor(100000 + Math.random() * 900000);
    request.session.bearer_token = json.access_token;

    response.redirect("/");
});

app.get("/logout", (request, response) => {
    if (!request.session.bearer_token) {
        // Caso não tenha nenhum Cookie, o servidor redireciona o usuário para a rota principal
        response.redirect("/");
    } else {
        // Remove os Cookies e redireciona o usuário para a rota principal
        request.session.destroy();
        response.redirect("/");
    }; // Verifica se o usuário tem um Cookie de Sessão
});

app.listen(port, () => {
    console.log("[SERVER] - Servidor Logado com Sucesso! iNsaNy Developers na Vóz!");
});