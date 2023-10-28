import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export function RSACryption(item: string, type?: boolean): string {
  const privateKey = fs.readFileSync(path.join(__dirname, "..", "RSA", "id_rsa"), 'utf8');
  if(!privateKey) throw new Error('Missing one of the RSA key.');
  if(type) 
    return crypto.privateDecrypt(privateKey, Buffer.from(item, "base64")).toString("utf8");

  const itemBuffer = Buffer.from(item);
  // 245 is the max length of the data that can be encrypted with RSA
  if(itemBuffer.byteLength > 245) {
    const chunks = [];
    for(let i = 0; i < itemBuffer.byteLength; i += 245)
      chunks.push(itemBuffer.subarray(i, i + 245));

    // TODO: Make it faster somehow
    const encryptedChunks = chunks.map(chunk => crypto.privateEncrypt(privateKey, chunk));
    return Buffer.concat(encryptedChunks).toString("base64");

  } else
    return crypto.privateEncrypt(privateKey, itemBuffer).toString("base64");
}