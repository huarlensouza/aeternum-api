"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');
var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _index = require('./routes/index'); var _index2 = _interopRequireDefault(_index);
var _expressvalidator = require('express-validator');
var _discord = require('./jobs/discord'); var _discord2 = _interopRequireDefault(_discord);

const app = _express2.default.call(void 0, );

app.use(_cors2.default.call(void 0, {
    origin:[process.env.URL_CORS]
}));
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));

app.use('/api',
    [
        _expressvalidator.body.call(void 0, 'nickname').isLength({ min: 5 }).withMessage('O nome do personagem precisa ter pelo menos 5 caracteres'),
        _expressvalidator.body.call(void 0, 'nickname').isLength({ max: 20 }).withMessage('O nome do personagem permite o máximo de 20 caracteres'),
        _expressvalidator.body.call(void 0, 'email').isEmail().withMessage('O e-mail precisa ser válido'),
        _expressvalidator.body.call(void 0, 'email').custom(async value => {
            if(!value) {
                return Promise.reject('E-mail é obrigatório');
            };
        }),
        _expressvalidator.body.call(void 0, 'weapon_primary').custom(async value => {
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
        _expressvalidator.body.call(void 0, 'weapon_secondary').custom(async value => {
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
        _expressvalidator.body.call(void 0, 'hour').custom(async value => {
            const [horas, minutos] = value.split(':')
            if(horas >= 0 && horas <= 23 && minutos >= 0 && minutos <= 59) {
                return true;
            };
            return Promise.reject('Data ou hora inválida');
        }),
        _expressvalidator.body.call(void 0, 'days').custom(async value => {
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
            };
            return true;
        })
    ],
    _cors2.default.call(void 0, ),
_index2.default);

app.listen(process.env.SERVER_PORT, () => {
    _discord2.default.run()
    console.log('Servidor iniciado com sucesso');
});