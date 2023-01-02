"use strict";Object.defineProperty(exports, "__esModule", {value: true});exports. default = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secureConnection: process.env.SECURE,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        ciphers: process.env.MAIL_CIPHERS
    }
};