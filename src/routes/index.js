import express from 'express';
import cors from 'cors';

import RegistroController from '../controllers/RegistroController';
import DiscordController from '../controllers/DiscordController';
const routes = express.Router();

const corsOptions = {
    origin:'http://177.209.229.53:3000/'
}

routes.get("/auth/discord", DiscordController.get);
routes.post("/auth/discord", DiscordController.post);

routes.post('/formulario', RegistroController.create);

export default routes;