import User from '../models/User'
import Championship from '../models/Championship'
import token from '../jobs/token';
import Enrollments from '../models/Enrollments';

export default {
    get: async(request, response) => {
        response.send(`https://discord.com/api/oauth2/authorize` + 
            `?client_id=${process.env.ID_DISCORD_CLIENT}` +
            `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}` +
            `&response_type=code&scope=${encodeURIComponent(process.env.DISCORD_SCOPE)}`
        );
    },
    post: async(request, response) => {
        const { code } = request.body.data;
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

        console.log(auth_discord)

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
        const user = await User.getUser(user_discord.id, user_discord.email);
        
        //Verifica se o Campeonato está com as inscrições abertas
        const championship = await Championship.isOpen();
        const id_championship = await Championship.getId();
        const enrollment = await Enrollments.getRegister(user_discord.id, id_championship);

        response.send({
            auth:true,
            discord: user_discord,
            user:user,
            member: user.length > 0 ? true : false,
            enrollment: !enrollment,
            championship: championship,
            access_token: token.encrypt(auth_discord.access_token)
        });
    }
};