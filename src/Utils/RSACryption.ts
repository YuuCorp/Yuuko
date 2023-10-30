import fs from "fs";
import path from "path";
import NodeRSA from "node-rsa";

/**
 *
 * @param item The item to decrypt/encrypt.
 * @param encrypt An optional boolean to specify if you want to encrypt the item.
 * @example RSACryption("Hello", true) // Encrypts the string "Hello"
 */
export function RSACryption(item: string, encrypt?: boolean): string {

  if (encrypt) {
    const publicRSA = path.join(__dirname, "..", "RSA", "id_rsa.pub");
    if (!fs.existsSync(publicRSA)) throw new Error("Missing public RSA key.");

    const encryptitem = new NodeRSA(fs.readFileSync(publicRSA, 'utf8'));
    return encryptitem.encrypt(item, "base64");
  }

  const privateRSA = path.join(__dirname, "..", "RSA", "id_rsa");
  if (!fs.existsSync(privateRSA)) throw new Error("Missing Private RSA key.");
  
  const decryptitem = new NodeRSA(fs.readFileSync(privateRSA, 'utf8'));
  return decryptitem.decrypt(item, "utf8");
}
