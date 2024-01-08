import crypto from 'crypto';
import { iv, cipherKey, cipherAlghoritm } from './constants';

export function DecryptKey(encryptedKey: string): string {
  let encryptedText = Buffer.from(encryptedKey, 'hex');
  let decipher = crypto.createDecipheriv(cipherAlghoritm, Buffer.from(cipherKey, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
