import { iv, cipherKey, cipherAlghoritm } from './constants'
import { createDecipheriv, createHash } from 'crypto';

export const decrypt = (key: string) => {
    let encryptedText = Buffer.from(key, "hex")
    let decipher = createDecipheriv(cipherAlghoritm, Buffer.from(cipherKey, 'hex'), Buffer.from(iv, 'hex'));
    var decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export const sha512 = (input: string) => createHash("sha512").update(input).digest("hex");

