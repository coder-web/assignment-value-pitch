
const mongoose = require('mongoose')
const response = require('../libs/responseLib');
const MisModel = mongoose.model('MIS');
const tokenLib = require('../libs/tokenLib');
const shortid = require('shortid');
const passwordLib = require('../libs/passwordLib');
const check = require('../libs/checkLib');


const saveData = (req, res) => {
    const isDataExist = (email, mobile) => {
        return new Promise((resolve, reject) => {
            MisModel.findOne({ $or: [{ 'email': email.trim().toLowerCase() }, { 'mobile': mobile }] },
                (err, result) => {
                    if (err) {
                        const apiResponse = response.generate(true, 'Email find err ' + err, 400, null);
                        reject(apiResponse);
                    } else if (!check.isEmpty(result)) {
                        const apiResponse = response.generate(true, 'Email or mobile no already exist', 400, null);
                        reject(apiResponse);
                    } else {

                        let data = new MisModel({
                            misId: shortid.generate(),
                            name: req.body.name,
                            fname: req.body.fname,
                            address: req.body.address,
                            email: req.body.email,
                            mobile: mobile,
                            createdBy: req.body.createdBy
                        });
                        data.save((err, result) => {
                            if (err) {
                                const apiResponse = response.generate(true, 'Unable to create new user data ' + err, 400, null);
                                reject(apiResponse);
                            } else {
                                let newUserObj = result.toObject();
                                delete newUserObj._id;
                                const apiResponse = response.generate(false, 'created successfully', 200, newUserObj);
                                resolve(apiResponse);
                            }
                        })
                    }
                });
        })
    }
    const checkParameters = async (req, res) => {
        try {
            if (check.isEmpty(req.body.name) ||
                check.isEmpty(req.body.fname) ||
                check.isEmpty(req.body.address) ||
                check.isEmpty(req.body.mobile) ||
                check.isEmpty(req.body.email)) {
                const apiResponse = response.generate(true, '1 or more parameters are missing', 400, null);
                res.json(apiResponse);
            } else {
                const response = await isDataExist(req.body.email, req.body.mobile);
                res.json(response);
            }
        } catch (err) {
            res.status(err.status || 500)
            res.send(err);
        }
    }
    checkParameters(req, res);
};

const getData = (req, res) => {

    const checkParameters = async () => {
        if (check.isEmpty(req.query.id)) {
            const apiResponse = response.generate(true, '1 or more parameters are missing', 400, null);
            res.json(apiResponse);
        }


        const length = req.body.length;


        const orderColumn = req.body.order[0].column;
        const dir = req.body.order[0].dir;
        let sort = '';

        switch (orderColumn) {
            case (0): sort = { 'name': dir };
            case (1): sort = { 'fname': dir };
            case (2): sort = { 'address': dir };
            case (3): sort = { 'email': dir };
            case (4): sort = { 'mobile': dir };
        }


        MisModel.countDocuments({ 'createdBy': req.query.id }, (err, count) => {
            MisModel.find({ 'createdBy': req.query.id })
                .sort(sort)
                .select()
                .populate('createdBy', 'name -_id')
                .lean()
                .limit(length)
                .skip(req.body.start)
                .exec((err, result) => {


                    result.forEach(element => {
                        element.createdBy = element.createdBy.name;
                    });

                    const objToSend = {
                        draw: 0,
                        recordsTotal: count,
                        recordsFiltered: count,
                        data: result
                    };
                    res.status(200);
                    res.json(objToSend);
                })
        })
    }

    checkParameters(req, res);
}

const deleteData = (req, res) => {

    const checkParameters = async (req, res) => {
        try {
            if (check.isEmpty(req.params.misId)) {
                const apiResponse = response.generate(true, 'mis id is missing', 400, null);
                res.json(apiResponse);
            } else {
                MisModel.findOneAndDelete({ 'misId': req.params.misId }, (err, result) => {
                    if (err) {
                        const apiResponse = response.generate(true, err, 500, null);
                        res.json(apiResponse);
                    }
                    else if (result.nModified === 0) {
                        const apiResponse = response.generate(true, 'unable to delete', 202, null);
                        res.json(apiResponse);
                    } else {
                        const apiResponse = response.generate(false, 'Deleted Successfully', 200, null);
                        res.json(apiResponse);
                    }
                })
            }
        } catch (err) {
            res.status(err.status || 500)
            res.send(err);
        }
    }
    checkParameters(req, res);
}


const updateData = (req, res) => {

    const checkParameters = async (req, res) => {
        try {
            if (check.isEmpty(req.params.misId)) {
                const apiResponse = response.generate(true, 'mis id is missing', 400, null);
                res.json(apiResponse);
            } else {
                MisModel.findOneAndUpdate({ 'misId': req.params.misId }, {
                    name: req.body.name,
                    fname: req.body.fname,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    address: req.body.address
                }, (err, result) => {
                    if (err) {
                        const apiResponse = response.generate(true, err, 500, null);
                        res.json(apiResponse);
                    }
                    else if (result.nModified === 0) {
                        const apiResponse = response.generate(true, 'unable to update', 202, null);
                        res.json(apiResponse);
                    } else {
                        const apiResponse = response.generate(false, 'Updated Successfully', 200, null);
                        res.json(apiResponse);
                    }
                })
            }
        } catch (err) {
            res.status(err.status || 500)
            res.send(err);
        }
    }
    checkParameters(req, res);
}
module.exports = {
    saveData: saveData,
    getData: getData,
    deleteData: deleteData,
    updateData: updateData
}