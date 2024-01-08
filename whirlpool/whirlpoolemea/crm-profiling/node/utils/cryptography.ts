import * as crypto from 'crypto';
import { cipherIV, cipherKey } from './constants';

export function GetHash(input: string) : string {
  let hash = crypto.createHash('sha256')
  let data = hash.update(input,'utf8').digest("hex");
  return data
} 

export function AES256Decode(ciphertext: string): string {
  let decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, cipherIV);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  return (plaintext + decipher.final('utf8'));
}
