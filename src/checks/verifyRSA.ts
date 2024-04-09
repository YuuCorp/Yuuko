import fs from 'fs'
import path from 'path'
import { rsaEncryption } from '../utils/rsaEncryption'
import { Check } from '../structures/check'

const rsaPublicCheck = new Check({
  name: 'RSA Public Key Check',
  description: 'Ensure that RSA/id_rsa.pub is present and valid. This is required to encrypt sensitive content.',
  optional: false,
  run: () => {
    if (!fs.existsSync(path.join(import.meta.dir, '..', 'RSA', 'id_rsa.pub')))
      throw new Error('RSA/id_rsa.pub does not exist.')
  },
})

const rsaPrivateCheck = new Check({
  name: 'RSA Private Key Check',
  description: 'Ensure that RSA/id_rsa is present and valid. This is required to decrypt sensitive content.',
  optional: false,
  run: () => {
    if (!fs.existsSync(path.join(import.meta.dir, '..', 'RSA', 'id_rsa')))
      throw new Error('RSA/id_rsa does not exist.')
  },
})

const rsaCryptionCheck = new Check({
  name: 'RSA Encryption & Decryption Check',
  description: 'Ensure that the RSA key\'s are valid by encryping & decrypting them seperately using public & private keys.',
  optional: false,
  run: async () => {
    if (await rsaEncryption(await rsaEncryption('hello', true)) !== 'hello')
      throw new Error('Public & Private RSA keys don\'t match.')
  },
})

export default [rsaPublicCheck, rsaPrivateCheck, rsaCryptionCheck]
