import { cipherIV, cipherKey } from "./constants";
const crypto = require('crypto');

export function sha_512(data: string): string {
  let hash = crypto.createHash('sha512');
  data = hash.update(data, 'utf-8').digest('hex');
  return data;
}

export function sha_512_256(data: string): string {
  let hash = crypto.createHash('sha512-256');
  data = hash.update(data, 'utf-8').digest('hex');
  return data;
}

export function AES256Decode(ciphertext: string): string {
  let decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, cipherIV);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf-8');
  return (plaintext + decipher.final('utf-8'));
}
