import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import routes from './routes/index'
import { body, validationResult } from 'express-validator';
import User from './models/User';
import discord from './jobs/discord';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "aeternumsecret",
    cookie: {
        maxAge: 86400000,
    }, 
    resave: true,
    saveUninitialized: false
}));

app.use('/api',
    [
        body('nickname').isLength({ min: 5 }).withMessage('O nome do personagem precisa ter pelo menos 5 caracteres'),
        body('nickname').isLength({ max: 20 }).withMessage('O nome do personagem permite o máximo de 20 caracteres'),
        body('email').isEmail().withMessage('O e-mail precisa ser válido'),
        body('email').custom(async value => {
            if(!value) {
                return Promise.reject('E-mail é obrigatório');
            }

            return User.register(value).then(response => {
                if(response) {
                    return Promise.reject('E-mail já cadastrado');
                }

                return true;
            });
        }),
        body('weapon_primary').custom(async value => {
            const armas = [
                'Espada e Escudo',
                'Rapieira',
                'Machadinha',
                'Lança',
                'Machadão',
                'Martelo de Guerra',
                'Espada Grande',
                'Arco',
                'Mosquete',
                'Bacamarte',
                'Bastão Flamejante',
                'Bastão Vital',
                'Manopla de Gelo',
                'Manopla Imaterial'
            ];

            if(!armas.includes(value)) {
                return Promise.reject('Arma primária inválida');
            };

            return true;
        }),
        body('weapon_secondary').custom(async value => {
            const armas = [
                'Espada e Escudo',
                'Rapieira',
                'Machadinha',
                'Lança',
                'Machadão',
                'Martelo de Guerra',
                'Espada Grande',
                'Arco',
                'Mosquete',
                'Bacamarte',
                'Bastão Flamejante',
                'Bastão Vital',
                'Manopla de Gelo',
                'Manopla Imaterial'
            ];

            if(!armas.includes(value)) {
                return Promise.reject('Arma secundária inválida');
            };

            return true;
        }),
        body('hour').custom(async value => {
            const [horas, minutos] = value.split(':')
        
            if(horas >= 0 && horas <= 23 && minutos >= 0 && minutos <= 59) {
                return true;
            };

            return Promise.reject('Data ou hora inválida');
        }),
        body('days').custom(async value => {
            const dias = [
                'Domingo',
                'Segunda-feira',
                'Terça-feira',
                'Quarta-feira',
                'Quinta-feira',
                'Sexta-feira',
                'Sábado'
            ];

            if(value.filter(x => !dias.includes(x)).length > 0) {
                return Promise.reject('Dia inválido');
            }

            return true
        })
    ],
routes);

app.listen(process.env.PORT, () => {
    discord.run()
    console.log('Servidor iniciado com sucesso');
});