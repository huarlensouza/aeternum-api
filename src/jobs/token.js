import crypto from 'crypto';

export default {
    encrypt: (text) => {
        const cipher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, Buffer.from(Buffer.from(process.env.CRYPTO_KEY, 'hex')), Buffer.from(process.env.CRYPTO_IV, 'hex'));
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    },
    decrypt: (text) => {
        const encryptedText = Buffer.from(text, 'hex');
        const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, Buffer.from(Buffer.from(process.env.CRYPTO_KEY, 'hex')), Buffer.from(process.env.CRYPTO_IV, 'hex'));
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}