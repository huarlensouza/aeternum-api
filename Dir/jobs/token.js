"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);

exports. default = {
    encrypt: (text) => {
        const cipher = _crypto2.default.createCipheriv(process.env.CRYPTO_ALGORITHM, Buffer.from(Buffer.from(process.env.CRYPTO_KEY, 'hex')), Buffer.from(process.env.CRYPTO_IV, 'hex'));
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    },
    decrypt: (text) => {
        const encryptedText = Buffer.from(text, 'hex');
        const decipher = _crypto2.default.createDecipheriv(process.env.CRYPTO_ALGORITHM, Buffer.from(Buffer.from(process.env.CRYPTO_KEY, 'hex')), Buffer.from(process.env.CRYPTO_IV, 'hex'));
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}