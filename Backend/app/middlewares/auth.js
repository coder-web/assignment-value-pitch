const token = require('../libs/tokenLib');
const responseLib = require('../libs/responseLib');

let isAuthorized = (req, res, next) => {
    if (req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')) {
        const authToken = req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken');
        token.verifyClaim(authToken, (err, decoded) => {
            if (err) {
                let apiResponse = responseLib.generate(true, 'Failed to authorize', 500, null);
                res.send(apiResponse);
            } else {
                next();
            }
        });
    } else {
        let apiResponse = responseLib.generate(true, 'Authentication token is missing in the request', 400, null);
        res.send(apiResponse);
    }
};


module.exports = {
    isAuthorized: isAuthorized
};