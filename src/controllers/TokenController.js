import Token from '../jobs/token';
import User from '../models/User'
import Championship from '../models/Championship'
import Enrollments from '../models/Enrollments';

export default {
    post: async(request, response) => {
        try {
            const { token, refresh_token } = request.body;

            const user_discord = await (
                await fetch("https://discord.com/api/users/@me", {
                    headers: {
                        authorization: `Bearer ${Token.decrypt(token)}`,
                    },
                })
            ).json();

            if(user_discord.message == '401: Unauthorized') return response.status(200).send({auth:false});

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
                access_token: token,
                refresh_token: refresh_token
            });
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        };
    }
};