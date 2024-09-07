import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";


function decryptWithPrivateKey(encryptedMessage) {
  // const pemPath = `private_key.pem`;


  // const RSA_PRIVATE_KEY = fs.readFileSync(
  //   path.join(__dirname, pemPath),
  //   "utf8"
  // );

  // console.log(RSA_PRIVATE_KEY)

  // if (RSA_PRIVATE_KEY) {
  //   const buffer = Buffer.from(encryptedMessage, "base64");
  //   const decrypted = crypto.privateDecrypt(RSA_PRIVATE_KEY, buffer);
  //   return decrypted.toString("utf8");
  // }
  return encryptedMessage;
}

export {decryptWithPrivateKey}