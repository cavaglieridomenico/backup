//@ts-nocheck

import { cipherIV, cipherKey } from "./constants";
const crypto = require('crypto');

export function AES256Encode(plaintext: string): string{
  let cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, cipherIV);
  let ciphertext = cipher.update(plaintext, 'utf-8', 'hex');
  return (ciphertext + cipher.final('hex'));
}

export function AES256Decode(ciphertext: string): string{
  let decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, cipherIV);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf-8');
  return (plaintext + decipher.final('utf-8'));
}
