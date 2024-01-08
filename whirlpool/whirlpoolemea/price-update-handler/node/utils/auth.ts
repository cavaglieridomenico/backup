import { createDecipheriv, createHash } from 'crypto'
import { cipherIV, cipherKey } from './constants';

export const sha512 = (input: string) => createHash("sha512").update(input).digest("hex");

export function AES256Decode(ciphertext: string): string {
  let decipher = createDecipheriv('aes-256-cbc', cipherKey, cipherIV);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  return (plaintext + decipher.final('utf-8'));
}
