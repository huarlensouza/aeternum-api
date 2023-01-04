"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Championship = require('../models/Championship'); var _Championship2 = _interopRequireDefault(_Championship);
var _token = require('../jobs/token'); var _token2 = _interopRequireDefault(_token);
var _Enrollments = require('../models/Enrollments'); var _Enrollments2 = _interopRequireDefault(_Enrollments);

exports. default = {
    get: async(request, response) => {
        response.send(`https://discord.com/api/oauth2/authorize` + 
            `?client_id=${process.env.ID_DISCORD_CLIENT}` +
            `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}` +
            `&response_type=code&scope=${encodeURIComponent(process.env.DISCORD_SCOPE)}`
        );
    },
    post: async(request, response) => {
        try {
            const { code } = request.body;
            console.log(request.body)
            if (!code) return response.status(200).send({auth:false});
            
            const data = new FormData();
            data.append("client_id", process.env.ID_DISCORD_CLIENT);
            data.append("client_secret", process.env.ID_DISCORD_CLIENT_SECRET);
            data.append("grant_type", "authorization_code");
            data.append("redirect_uri", process.env.DISCORD_REDIRECT_URI);
            data.append("scope", process.env.DISCORD_SCOPE);
            data.append("code", code);
    
            //JSON da autentificação do Usuário
            const auth_discord = await (
                await fetch("https://discord.com/api/oauth2/token", {
                    method: "POST",
                    body: data
                })
            ).json();
    
            if(auth_discord.error == 'invalid_grant') return response.status(200).send({auth:false});
    
            //JSON com as informações do Usuário
            const user_discord = await (
                await fetch("https://discord.com/api/users/@me", {
                    headers: {
                        authorization: `${auth_discord.token_type} ${auth_discord.access_token}`,
                    },
                })
            ).json();
    
            //Verifica se existe o usuário
            const user = await _User2.default.getUser(user_discord.id, user_discord.email);
            
            //Verifica se o Campeonato está com as inscrições abertas
            const championship = await _Championship2.default.isOpen();
            const id_championship = await _Championship2.default.getId();
            const enrollment = await _Enrollments2.default.getRegister(user_discord.id, id_championship);
    
            response.send({
                auth:true,
                discord: user_discord,
                user:user,
                member: user.length > 0 ? true : false,
                enrollment: !enrollment,
                championship: championship,
                access_token: _token2.default.encrypt(auth_discord.access_token)
            });
        } catch(e) {
            return response.status(200).send({auth:false})
        }
    }
};