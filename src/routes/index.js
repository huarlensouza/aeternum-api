import express from 'express';
import RegistroController from '../controllers/RegistroController';
import User from '../models/User'
import Campeonato from '../models/Campeonato'

const config = require('../config/discord.json')

const routes = express.Router();

routes.get('/', async (request, response) => {
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

routes.post('/formulario', RegistroController.create);

routes.get("/auth/discord", (request, response) => {
    response.send(`https://discord.com/api/oauth2/authorize` + 
        `?client_id=${config.oauth2.client_id}` +
        `&redirect_uri=${encodeURIComponent(config.oauth2.redirect_uri)}` +
        `&response_type=code&scope=${encodeURIComponent(config.oauth2.scopes.join(" "))}`
    );
});

routes.post("/auth/discord/sign", async (request, response) => {
    const { code } = request.body.data;
    if (!code) return response.send("/");

    const data = new FormData();
    data.append("client_id", config.oauth2.client_id);
    data.append("client_secret", process.env.CLIENT_SECRET);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", config.oauth2.redirect_uri);
    data.append("scope", config.oauth2.scopes.join(' '));
    data.append("code", code);

    const json = await (
        await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: data
        })
    ).json();

    const userJson = await (
        await fetch("https://discord.com/api/users/@me", {
            headers: {
                authorization: `${json.token_type} ${json.access_token}`,
            },
        })
    ).json();

    const check = await User.register(userJson.email)
    const campeonato = await Campeonato.getId();

    request.session.user_info = userJson;
    request.session.bearer_token = json.access_token

    response.send({
        auth:userJson.code == 0 ? false : true,
        user:userJson,
        registered: check,
        register: campeonato[0].inscricoes == 1 ? true : false,
        access_token: json.access_token
    })
});

routes.get("/logout", (request, response) => {
    if (!request.session.bearer_token) {
        // Caso não tenha nenhum Cookie, o servidor redireciona o usuário para a rota principal
        response.redirect("/");
    } else {
        // Remove os Cookies e redireciona o usuário para a rota principal
        request.session.destroy();
        response.redirect("/");
    }; // Verifica se o usuário tem um Cookie de Sessão
});

export default routes;