const fs = require('fs');
const path = require('path');
const NodeRSA = require('node-rsa');

/**
 * 
 * @param {String} item The item to decrypt/encrypt.
 * @param {Boolean} type If true decrypts it, if false it encrypts it. By default is true.
 * @returns {*} The decrypted/encrypted item.
 */
module.exports = function (item, type = true) {
    if (type === true) {
        let itemContent = path.join(__dirname, '../RSA/id_rsa');

        if (!fs.existsSync(itemContent)) {
            throw new Error('Missing Private RSA key.')
        }

        const decryptitem = new NodeRSA(fs.readFileSync(itemContent).toString());
        return decryptitem.decrypt(item, 'utf8');
    } else {
        let itemContent = path.join(__dirname, '../RSA/id_rsa.pub');

        if (!fs.existsSync(itemContent)) {
            throw new Error('Missing public RSA key.')
        };

        const encryptitem = new NodeRSA(fs.readFileSync(itemContent).toString());
        return encryptitem.encrypt(item, 'base64');
    };
};