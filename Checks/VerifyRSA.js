const Check = require("#Structures/Check.js");
const fs = require("fs");
const path = require("path");

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

module.exports = [rsaPublicCheck, rsaPrivateCheck]