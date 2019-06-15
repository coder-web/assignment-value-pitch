
const appConfig = require("../../config/appConfig");
const controller = require('../controllers/misController');
const auth = require('../middlewares/auth');
module.exports.setRouter = (app) => {
    let baseUrl = appConfig.apiVersion + '/mis';

    app.post(`${baseUrl}`, auth.isAuthorized, controller.saveData);

    app.post(`${baseUrl}/getrecords`, auth.isAuthorized, controller.getData);

    app.delete(`${baseUrl}/:misId`, auth.isAuthorized, controller.deleteData);

    app.put(`${baseUrl}/:misId`, auth.isAuthorized, controller.updateData);

};

