"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _nodemailer = require('nodemailer'); var _nodemailer2 = _interopRequireDefault(_nodemailer);
var _mail = require('../config/mail'); var _mail2 = _interopRequireDefault(_mail);

exports. default = _nodemailer2.default.createTransport(_mail2.default);