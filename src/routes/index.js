import express from 'express';

import RegistroController from '../controllers/RegistroController';
import DiscordController from '../controllers/DiscordController';
import RankingController from '../controllers/RankingController';
import ChampionController from '../controllers/ChampionController';
import TokenController from '../controllers/TokenController';
import ChampionshipController from '../controllers/ChampionshipController';

const routes = express.Router();


routes.get("/auth/discord", DiscordController.get);
routes.post("/auth/discord", DiscordController.post);

routes.get("/ranking", RankingController.get);
routes.post("/ranking-individual", RankingController.getRankingIndividual);
routes.get("/last-champion", ChampionController.get);

routes.get('/championship', ChampionshipController.get);
routes.post('/championships', ChampionshipController.getChampionships)
routes.post('/duels-championship', ChampionshipController.getDuels);

routes.post('/formulario', RegistroController.create);

routes.post('/enrollment', RegistroController.update);
routes.delete('/enrollment', RegistroController.delete);

routes.post('/valid-token', TokenController.post);

export default routes;