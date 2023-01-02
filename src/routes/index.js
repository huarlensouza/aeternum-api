import express from 'express';

import RegistroController from '../controllers/RegistroController';
import DiscordController from '../controllers/DiscordController';

const routes = express.Router();

routes.get("/auth/discord", DiscordController.get);
routes.post("/auth/discord", DiscordController.post);

routes.post('/formulario', RegistroController.create);

export default routes;