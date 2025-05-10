import { subtle } from "crypto";
import fs from "fs";
import path from "path";

type RSAkey = CryptoKey & { algorithm: { modulusLength: number } };

export class RSA {
  private static publicKey: RSAkey;
  private static privateKey: RSAkey;

  private enc: TextEncoder;
  private dec: TextDecoder;

  constructor() {
    this.enc = new TextEncoder();
    this.dec = new TextDecoder();
  }

  private static async generateRSAPair() {
    const RSAdirectory = path.join(import.meta.dir, 'RSA');
    if (fs.existsSync(path.join(RSAdirectory, 'id_rsa'))) return;

    const keyPair = await subtle.generateKey({
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // Value taken from https://developer.mozilla.org/en-US/docs/Web/API/RsaHashedKeyGenParams#publicexponent
      hash: "SHA-256",
    }, true, ['encrypt', 'decrypt'])

    const publicKey = await subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await subtle.exportKey('pkcs8', keyPair.privateKey)

    const exportedPublicKey = RSA.toPEM(publicKey, "PUBLIC");
    const exportedPrivateKey = RSA.toPEM(privateKey, "PRIVATE");

    if (!fs.existsSync(RSAdirectory)) fs.mkdirSync(RSAdirectory);

    fs.writeFileSync(path.join(RSAdirectory, 'id_rsa'), exportedPrivateKey);
    fs.writeFileSync(path.join(RSAdirectory, 'id_rsa.pub'), exportedPublicKey);
  }

  static async loadKeys() {
    const _publicRSA = path.join(import.meta.dir, "..", "RSA", "id_rsa.pub");
    const _privateRSA = path.join(import.meta.dir, "..", "RSA", "id_rsa");

    const publicExists = fs.existsSync(_publicRSA);
    const privateExists = fs.existsSync(_privateRSA);
    if (!publicExists && !privateExists) await RSA.generateRSAPair();
    else if (!publicExists) throw new Error("Missing public RSA key.");
    else if (!privateExists) throw new Error("Missing private RSA key.");

    const publicKey = await subtle.importKey('spki', RSA.loadPEM(_publicRSA), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    const privateKey = await subtle.importKey('pkcs8', RSA.loadPEM(_privateRSA), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);

    RSA.publicKey = publicKey as RSAkey;
    RSA.privateKey = privateKey as RSAkey;
  }

  async encrypt(item: string) {
    const itemBuffer = this.enc.encode(item);
    // https://crypto.stackexchange.com/a/42100
    // ^ According to this comment we can calculate the chunk size with the formula ( ( modulusLength / 8 ) - ( 2 * hLenBits / 8 ) - 2 )
    // hLenBits is the length of the hash function output in bits, which is 256 for SHA-256
    const chunkSize = RSA.publicKey.algorithm.modulusLength / 8 - 2 * 256 / 8 - 2;

    const encryptedItem = (itemBuffer.byteLength > chunkSize) ?
      await this.splitToChunks(itemBuffer, chunkSize, RSA.publicKey, 'encrypt') :
      await subtle.encrypt('RSA-OAEP', RSA.publicKey, itemBuffer);

    return Buffer.from(encryptedItem).toString("base64");
  }

  async decrypt(item: string) {
    const itemBuffer = Buffer.from(item, "base64");
    const chunkSize = RSA.privateKey.algorithm.modulusLength / 8;

    const decryptedItem = (itemBuffer.byteLength > chunkSize) ?
      await this.splitToChunks(itemBuffer, chunkSize, RSA.privateKey, 'decrypt') :
      await subtle.decrypt('RSA-OAEP', RSA.privateKey, itemBuffer);

    return this.dec.decode(decryptedItem);
  }

  // Helpers

  private static loadPEM(path: string) {
    return Buffer.from(
      fs.readFileSync(path, "utf8")
        .replace(/-----(BEGIN|END) (PUBLIC|PRIVATE) KEY-----|\s+/g, ''),
      "base64"
    );

  }

  private static toPEM(keyData: ArrayBuffer, type: "PUBLIC" | "PRIVATE") {
    const base64 = Buffer.from(keyData).toString("base64");
    const formatted = base64.match(/.{1,64}/g)?.join('\n') ?? base64;
    return `-----BEGIN ${type} KEY-----\n${formatted}\n-----END ${type} KEY-----`;
  }

  private async splitToChunks(
    itemBuffer: Uint8Array | ArrayBuffer,
    chunkSize: number,
    RSA: RSAkey,
    type: 'encrypt' | 'decrypt'
  ) {
    const chunks = [];
    for (let i = 0; i < itemBuffer.byteLength; i += chunkSize) {
      chunks.push(itemBuffer.slice(i, i + chunkSize));
    }
    const workChunks: ArrayBuffer[] = [];
    for (const chunk of chunks) {
      if (type === 'encrypt') workChunks.push(await subtle.encrypt('RSA-OAEP', RSA, chunk));
      else workChunks.push(await subtle.decrypt('RSA-OAEP', RSA, chunk));
    }

    const workItem = new Uint8Array(workChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0));
    let offset = 0;
    for (const chunk of workChunks) {
      workItem.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }
    return workItem.buffer;
  }

}