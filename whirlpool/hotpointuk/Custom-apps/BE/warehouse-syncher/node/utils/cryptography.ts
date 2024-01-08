import { HashAlgorithm } from "../typings/hash";
import { cipherIV, cipherKey } from "./constants";
const crypto = require('crypto');

export function hash(data: string, hashFunction: string): string {
  hashFunction = getHashFunction(hashFunction);
  let hash = crypto.createHash(hashFunction);
  data = hash.update(data, 'utf-8').digest('hex');
  return data;
}

export function AES256Decode(ciphertext: string | undefined): string {
  let decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, cipherIV);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf-8');
  return (plaintext + decipher.final('utf-8'));
}

export function getHashFunction(hashCode: string): string {
  switch (hashCode) {
    case HashAlgorithm.SHA_512_256:
      return "sha512-256";
    case HashAlgorithm.SHA_256:
      return "sha256";
    default:
      throw Error("Unsupported hash function (" + hashCode + ")");
  }
}
