import User from '../models/User'
import Championship from '../models/Championship'
import Enrollments from '../models/Enrollments';
import token from '../jobs/token';

export default {
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
            if (!code) return response.status(200).send({auth:false, verified:false});
            
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
    
            if(auth_discord.error == 'invalid_grant') return response.status(200).send({auth:false, verified:false});
    
            //JSON com as informações do Usuário
            const user_discord = await (
                await fetch("https://discord.com/api/users/@me", {
                    headers: {
                        authorization: `${auth_discord.token_type} ${auth_discord.access_token}`,
                    },
                })
            ).json();

            if(!user_discord.verified) return response.status(200).send({auth:true, verified:false});
            
            //Buscar usuário
            const user = await User.getUser(user_discord.id);
            
            //Buscar alistamento
            const userEnrollment = await Enrollments.getUser(user_discord.id);
    
            response.status(200).send({
                verified:true,
                auth:true,
                discord: user_discord,
                user:user,
                enrollment: userEnrollment,
                access_token: token.encrypt(auth_discord.access_token),
                refresh_token: token.encrypt(auth_discord.refresh_token)
            });
        } catch(e) {
            return response.status(200).send({auth:false})
        }
    }
};