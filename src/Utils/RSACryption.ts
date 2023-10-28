import fs from 'fs'
import path from 'path'
import NodeRSA from 'node-rsa'

/**
 *
 * @param item The item to decrypt/encrypt.
 * @param type If true decrypts it, if false it encrypts it. By default is true.
 */
export function RSACryption(item: string, type = true): string {
  if (type === true) {
    const itemContent = path.join(__dirname, "..", "RSA", "id_rsa")

    if (!fs.existsSync(itemContent))
      throw new Error('Missing Private RSA key.')

    const decryptitem = new NodeRSA(fs.readFileSync(itemContent).toString())
    return decryptitem.decrypt(item, 'utf8')
  }
  else if (type === false) {
    const itemContent = path.join(__dirname, "..", "RSA", "id_rsa.pub")

    if (!fs.existsSync(itemContent))
      throw new Error('Missing public RSA key.')

    const encryptitem = new NodeRSA(fs.readFileSync(itemContent).toString())
    return encryptitem.encrypt(item, 'base64')
  }
  else {
    throw new Error('Invalid type.')
  }
}
