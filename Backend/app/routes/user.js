
const appConfig = require("../../config/appConfig");
const userController = require('../controllers/userController');

module.exports.setRouter = (app) => {
    let baseUrl = appConfig.apiVersion + '/users';

    app.post(`${baseUrl}/signup`, userController.signup);

    
    app.post(`${baseUrl}/login`, userController.login);

};

