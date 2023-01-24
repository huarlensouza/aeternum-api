import Championship from "../models/Championship";

export default {
    get: async(request, response) => {
        try {
            const championship = await Championship.getOpen();
            return response.status(200).send(championship);
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        }
    }
}