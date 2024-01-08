import { HashAlgorithm } from "../typings/hash";
import { hash } from "./cryptography";

export class DigestAuth {

  computeDigest(username: string, psw: string, realme: string, method: string, digestURI: string, nonce: string, hashFunction: string): string {
    let h1 = hash(username + ":" + realme + ":" + psw, hashFunction);
    let h2 = hash(method + ":" + digestURI, hashFunction);
    return hash(h1 + ":" + nonce + ":" + h2, hashFunction);
  }

  randomNonce(): string { return hash(Date.now() + "", HashAlgorithm.SHA_256).substring(0, 32) }

}
