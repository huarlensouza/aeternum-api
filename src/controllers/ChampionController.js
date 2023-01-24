import Enrollments from '../models/Enrollments';

export default {
    get: async(request, response) => {
        try {
            const ranking = await Enrollments.getChampion();
            return response.status(200).send(ranking);
        } catch(e) {
            console.log(e);
            return response.status(500).send({message: e});
        }
    }
}