import * as crypto from 'crypto';
import { cipherIV, cipherKey } from './constants';

export function sha512(data: string): string {
  let hash = crypto.createHash('sha512');
  data = hash.update(data, 'utf8').digest('hex');
  return data;
}

export function AES256Decode(ciphertext: string): string {
  let decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, cipherIV);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  return (plaintext + decipher.final('utf8'));
}
