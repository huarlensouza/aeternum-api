import Mail from '../lib/Mail'

export default {
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

            await Mail.verify()
            .then(() => {
                console.log('Serviço de e-mail iniciado com sucesso.');
            }).catch(console.error);

            await Mail.sendMail({
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