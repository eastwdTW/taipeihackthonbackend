import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";

function decryptWithPrivateKey(encryptedMessage) {
    const privateKey = fs.readFileSync(path.join(__dirname, 'private_key.pem'), 'utf8');

    try {
        const encryptedBuffer = Buffer.from(encryptedMessage, 'base64');

        const decrypted = crypto.privateDecrypt(
            {
                key: crypto.createPrivateKey({
                    key: privateKey,
                    format: 'pem',
                    type: 'pkcs1', 
                }),

                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
            },
            encryptedBuffer
        );

        console.log('Decrypted:', decrypted.toString('utf8'));
    } catch (err) {
        console.error('Decryption failed:', err.message);
    }
    return encryptedMessage;
}

export {decryptWithPrivateKey}