import fs from "fs";
import path from "path";

type RSAkey = CryptoKey & { algorithm: { modulusLength: number } };

/**
 * @param item The item to decrypt/encrypt.
 * @param encrypt An optional boolean to specify if you want to encrypt the item.
 * @example RSACryption("Hello", true) // Encrypts the string "Hello"
 */
export async function RSACryption(item: string, encrypt?: boolean): Promise<string> {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  
  if (encrypt) {
    const itemBuffer = enc.encode(item);
    const _publicRSA = path.join(import.meta.dir, "..", "RSA", "id_rsa.pub")
    if (!fs.existsSync(_publicRSA)) throw new Error("Missing public RSA key.");

    let publicRSA = fs.readFileSync(_publicRSA, "utf8")
    publicRSA = publicRSA.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replaceAll('\n', '');
    const publicRSAData = str2ab(atob(publicRSA));
    const cryptoKey = await globalThis.crypto.subtle.importKey('spki', publicRSAData, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']) as RSAkey;
    // https://crypto.stackexchange.com/a/42100
    // ^ According to this comment we can calculate the chunk size with the formula ( ( modulusLength / 8 ) - ( 2 * hLenBits / 8 ) - 2 )
    // hLenBits is the length of the hash function output in bits, which is 256 for SHA-256
    const chunkSize = cryptoKey.algorithm.modulusLength / 8 - 2 * 256 / 8 - 2;

    if(itemBuffer.byteLength > chunkSize )
      return abtob64(await splitToChunks(itemBuffer, chunkSize, cryptoKey, 'encrypt'));

    const encryptItem = await globalThis.crypto.subtle.encrypt('RSA-OAEP', cryptoKey, itemBuffer);
    return abtob64(encryptItem);
  }

  const _privateRSA = path.join(import.meta.dir, "..", "RSA", "id_rsa") 
  if (!fs.existsSync(_privateRSA)) throw new Error("Missing private RSA key.");

  let privateRSA = fs.readFileSync(_privateRSA, "utf8");
  privateRSA = privateRSA.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replaceAll('\n', '');
  const privateRSAData = str2ab(atob(privateRSA));
  const cryptoKey = await globalThis.crypto.subtle.importKey('pkcs8', privateRSAData, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']) as RSAkey;

  const itemBuffer = str2ab(atob(item));
  const chunkSize = cryptoKey.algorithm.modulusLength / 8;

  if(itemBuffer.byteLength > chunkSize)
    return dec.decode(await splitToChunks(itemBuffer, chunkSize, cryptoKey, 'decrypt'));

  const decryptItem = await globalThis.crypto.subtle.decrypt('RSA-OAEP', cryptoKey, itemBuffer);
  return dec.decode(decryptItem);
}

async function splitToChunks(
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
    if (type === 'encrypt') workChunks.push(await globalThis.crypto.subtle.encrypt('RSA-OAEP', RSA, chunk));
    else workChunks.push(await globalThis.crypto.subtle.decrypt('RSA-OAEP', RSA, chunk));
  }

  const workItem = new Uint8Array(workChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0));
  let offset = 0;
  for (const chunk of workChunks) {
    workItem.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }
  return workItem;
}

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function abtob64(buffer: Uint8Array | ArrayBuffer) {
  const binary = [];
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++)
    binary.push(String.fromCharCode(bytes[i]!));

  return btoa(binary.join(''));
}