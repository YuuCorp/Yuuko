const fs = require('fs');
const path = require('path');
const NodeRSA = require('node-rsa');

module.exports = function (token, type = true) {
    if (type === true) {
        let tokenContent = path.join(__dirname, '../RSA/id_rsa');

        if (!fs.existsSync(tokenContent)) {
            throw new Error('Missing Private RSA key.')
        }

        const decryptToken = new NodeRSA(fs.readFileSync(tokenContent).toString());
        return decryptToken.decrypt(token, 'utf8');
    } else {
        let tokenContent = path.join(__dirname, '../RSA/id_rsa.pub');

        if (!fs.existsSync(tokenContent)) {
            throw new Error('Missing public RSA key.')
        };

        const encryptToken = new NodeRSA(fs.readFileSync(tokenContent).toString());
        return encryptToken.encrypt(token, 'base64');
    };
};