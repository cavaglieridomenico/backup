import { createCipheriv, createDecipheriv, randomBytes } from "crypto";



const algorithm = "aes-256-cbc";

const [
  ,
  ,
  type,
  data,
  key = randomBytes(32).toString("hex"),
  iv = randomBytes(16).toString("hex"),
] = process.argv;

console.log(key, "key");
console.log(iv, "iv");

function encrypt(text) {
  const cipher = createCipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

function decrypt(enc) {
  let encryptedText = Buffer.from(enc, "hex");
  let decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

console.log(type)
if (type == "enc") {
  console.log(encrypt(data), "encrypt(data)");
} else if (type == "dec") {
  console.log(decrypt(data), "decrypt(data)");
}
