//@ts-nocheck

import crypto from 'crypto';
import { iv, cipherKey, cipherAlghoritm } from './constants';

export function DecryptKey(encryptedKey: string): string {
  let encryptedText = Buffer.from(encryptedKey, 'hex');
  let decipher = crypto.createDecipheriv(cipherAlghoritm, Buffer.from(cipherKey, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export const Encrypt = (input: string) => {
  let cipher = crypto.createCipheriv(cipherAlghoritm, Buffer.from(cipherKey, 'hex'), Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(input);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex')
}

export const GetHash = (input: string): string => {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function CreateToken(): string {
  return crypto.randomBytes(16).toString('hex')
}
