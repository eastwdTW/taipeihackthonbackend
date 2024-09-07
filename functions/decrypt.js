const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

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
}

const encryptedMessage = "Ms5GCL7OAh4gTtSlf398WVNTBD71EqGEfm/rBQO+v++Zb9sVBz0RspGkEklFjL5HY0e95CTY7LcSqeA88wzve5HR4ktRYpEfHokbVla9rSrYTCn/MurghryqLleK8cMk6qRSZEXInhmXyEPVsKv/LffqR+BJ8QcLBrKIhEFFZ9M=";
decryptWithPrivateKey(encryptedMessage);
