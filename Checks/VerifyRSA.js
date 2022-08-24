const Check = require("#Structures/Check.js");
const fs = require("fs");
const path = require("path");
const NodeRSA = require('node-rsa');
const encryptor = new NodeRSA(fs.readFileSync(path.join(__dirname, '../RSA/id_rsa.pub').toString()));
const decryptor = new NodeRSA(fs.readFileSync(path.join(__dirname, '../RSA/id_rsa').toString()));

const rsaPublicCheck = new Check({
    name: "RSA Public Key Check",
    description: "Ensure that RSA/id_rsa.pub is present and valid. This is required to encrypt sensitive content.",
    optional: false,
    run: () => {
        if (!fs.existsSync(path.join(__dirname, "..", "RSA", "id_rsa.pub"))) {
            throw new Error("RSA/id_rsa.pub does not exist.")
        }
    }
})

const rsaPrivateCheck = new Check({
    name: "RSA Private Key Check",
    description: "Ensure that RSA/id_rsa is present and valid. This is required to decrypt sensitive content.",
    optional: false,
    run: () => {
        if (!fs.existsSync(path.join(__dirname, "..", "RSA", "id_rsa"))) {
            throw new Error("RSA/id_rsa does not exist.")
        }
    }
})

const rsaCryptionCheck = new Check({
    name: "RSA Encryption & Decryption Check",
    description: "Ensure that the RSA key's are valid by encryping & decrypting them seperately using public & private keys.",
    optional: false,
    run: () => {
        if (decryptor.decrypt(encryptor.encrypt('hello', 'base64'), 'utf8') != "hello") {
            throw new Error("Public & Private RSA keys don't match.")
        }
    }
})

module.exports = [rsaPublicCheck, rsaPrivateCheck, rsaCryptionCheck]