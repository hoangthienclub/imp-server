var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';

function decrypt(token, password) {
    try {
        var decipher = crypto.createDecipher(algorithm, new Buffer(password).toString())
        var dec = decipher.update(token, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
    catch(e) {
        return "";
    }
}

module.exports = {
    decrypt: decrypt
}