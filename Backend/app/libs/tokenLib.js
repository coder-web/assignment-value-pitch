
const jwt = require('jsonwebtoken');
const secretKey = 'CanYouGue$$!t';

let generateToken = (data, cb) => {
    try {
        const claims = {
            iat: Date.now(),
            sub: 'AuthToken',
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            iss: 'Assignment_ValuePitch',
            data: data
        };

        const token = jwt.sign(claims, secretKey);
        cb(null, token);
    } catch (error) {
        cb(error, null);
    }
}

let verifyClaim = (token, cb) => {
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
            console.log(err);
            cb(err, null);
        } else {
            cb(null, decoded);
        }
    });
}; //end of verify claim without secret
module.exports = {
    generateToken: generateToken,
    verifyClaim: verifyClaim
};