"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);

var _RegistroController = require('../controllers/RegistroController'); var _RegistroController2 = _interopRequireDefault(_RegistroController);
var _DiscordController = require('../controllers/DiscordController'); var _DiscordController2 = _interopRequireDefault(_DiscordController);

const routes = _express2.default.Router();

routes.get("/auth/discord", _DiscordController2.default.get);
routes.post("/auth/discord", _DiscordController2.default.post);

routes.post('/formulario', _RegistroController2.default.create);

exports. default = routes;