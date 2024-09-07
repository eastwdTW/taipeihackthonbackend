import fs from "fs";
import crypto from "crypto";
import path from "path";

function decryptWithPrivateKey(encryptedMessage) {

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
      },
      privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: 'top secret'
      }
  });
  console.log(privateKey)

  // Encrypt and decrypt
  const data = 'Hello, world!';
  const encrypted = crypto.publicEncrypt(
      {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      Buffer.from(data)
  );

  const decrypted = crypto.privateDecrypt(
      {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      encrypted
  );

  console.log('Decrypted:', decrypted.toString('utf8'));

  // const pemPath = `private_key.pem`;


  // const RSA_PRIVATE_KEY = fs.readFileSync(
  //   path.join(__dirname, pemPath),
  //   "utf8"
  // );

  // console.log(RSA_PRIVATE_KEY)

  // if (RSA_PRIVATE_KEY) {
  //   const buffer = Buffer.from(encryptedMessage, "base64");
  //   const decrypted = crypto.privateDecrypt(
  //     {
  //       key: RSA_PRIVATE_KEY,
  //       padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  //     },
  //     buffer
  //   );
  //   return decrypted.toString("utf8");
  // }
}

export {decryptWithPrivateKey};