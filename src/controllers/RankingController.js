import Duels from '../models/Duels';

export default {
    get: async(request, response) => {
        try {
            const ranking = await Duels.getRanking();
            return response.status(200).send(ranking);
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        }
    },
    getRankingIndividual: async(request, response) => {
        try {
            const { id_discord } = request.body;

            const ranking = await Duels.getRankingIndividual(id_discord);
            return response.status(200).send(ranking);
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        }
    }
}