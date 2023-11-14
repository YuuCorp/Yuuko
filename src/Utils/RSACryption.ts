import fs from "fs";
import path from "path";


/**
 *
 * @param item The item to decrypt/encrypt.
 * @param encrypt An optional boolean to specify if you want to encrypt the item.
 * @example RSACryption("Hello", true) // Encrypts the string "Hello"
 */
export async function RSACryption(item: any, encrypt?: boolean): Promise<string> {
  const enc = new TextEncoder();
  const dec = new TextDecoder('utf-8');

  if (encrypt) {
    const itemBuffer = enc.encode(item);
    const _publicRSA = path.join(__dirname, "..", "RSA", "id_rsa.pub")
    if (!fs.existsSync(_publicRSA)) throw new Error("Missing public RSA key.");

    let publicRSA = fs.readFileSync(_publicRSA, "utf8")
    publicRSA = publicRSA.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replaceAll('\n', '');
    const publicRSAData = str2ab(atob(publicRSA));
    const cryptoKey = await globalThis.crypto.subtle.importKey('spki', publicRSAData, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    if(itemBuffer.byteLength > 245 ) {
      const chunks = [];
      const chunkSize = 245;
      for (let i = 0; i < itemBuffer.byteLength; i += chunkSize) {
        chunks.push(itemBuffer.slice(i, i + chunkSize));
      }
      const encryptedChunks: ArrayBuffer[] = [];
      for (const chunk of chunks) {
        encryptedChunks.push(await globalThis.crypto.subtle.encrypt('RSA-OAEP', cryptoKey, chunk));
      }
      
      const encryptedItem = new Uint8Array(encryptedChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0));
      let offset = 0;
      for (const chunk of encryptedChunks) {
        encryptedItem.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }
      console.log(arrayBufferToBase64(encryptedItem));
      return arrayBufferToBase64(encryptedItem);
    }
    const encryptItem = await globalThis.crypto.subtle.encrypt('RSA-OAEP', cryptoKey, itemBuffer);
    return arrayBufferToBase64(encryptItem);
  }
  const _privateRSA = path.join(__dirname, "..", "RSA", "id_rsa") 
  if (!fs.existsSync(_privateRSA)) throw new Error("Missing private RSA key.");

  let privateRSA = fs.readFileSync(_privateRSA, "utf8");
  privateRSA = privateRSA.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replaceAll('\n', '');
  const privateRSAData = str2ab(atob(privateRSA));
  const cryptoKey = await globalThis.crypto.subtle.importKey('pkcs8', privateRSAData, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
  console.log(cryptoKey)
  const itemBuffer = str2ab(atob(item));
  const chunkSize = cryptoKey.algorithm.modulusLength / 8;
  console.log(chunkSize)
  if(itemBuffer.byteLength > chunkSize) {
    const chunks = [];
    for (let i = 0; i < itemBuffer.byteLength; i += chunkSize) {
      chunks.push(itemBuffer.slice(i, i + chunkSize));
    }
    const decryptedChunks: ArrayBuffer[] = [];
    for (const chunk of chunks) {
      decryptedChunks.push(await globalThis.crypto.subtle.decrypt('RSA-OAEP', cryptoKey, chunk));
    }
    
    const decryptedItem = new Uint8Array(decryptedChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0));
    let offset = 0;
    for (const chunk of decryptedChunks) {
      decryptedItem.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }
    return dec.decode(decryptedItem);
  }
  const decryptItem = await globalThis.crypto.subtle.decrypt('RSA-OAEP', cryptoKey, itemBuffer);
  return dec.decode(decryptItem);
}

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function arrayBufferToBase64(buffer: Uint8Array | ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i] || 0);
  }
  return btoa(binary);
}