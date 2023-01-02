"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Mail = require('../lib/Mail'); var _Mail2 = _interopRequireDefault(_Mail);

exports. default = {
    async send(nome, codigo, email) {
        try {

            const html = `
                Seu código de acesso é:
                <b>12323131</b>
                </br>
                </br>

                Olá, Marmozele,
                Por favor retorno a página de cadastro e insira o código acima para confirmar sua identidade.

                Abraços,
                Equipe Aeternum
            `

            await _Mail2.default.verify()
            .then(() => {
                console.log('Serviço de e-mail iniciado com sucesso.');
            }).catch(console.error);

            await _Mail2.default.sendMail({
                from: 'Arena Aeternum <huarlen@jra-automacao.com.br>',
                to: 'huarlensouza@hotmail.com',
                subject: `O seu código de acesso é: 123123`,
                html: html
            });

            return true;
        } catch(e) {
            return false;
        };
    }
}