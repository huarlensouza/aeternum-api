import Championship from "../models/Championship";
import Duels from "../models/Duels";
export default {
    get: async(request, response) => {
        try {
            const championship = await Championship.getOpen();
            return response.status(200).send(championship);
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        }
    },
    getDuels: async(request, response) => {
        try {
            const { id_championship } = request.body;
            const championship = await Duels.getDuels(id_championship);
            return response.status(200).send(championship);
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        }
    },
    getChampionships: async(request, response) => {
        try {
            const championships = await Championship.getAll();
            return response.status(200).send(championships);
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        }
    },
}