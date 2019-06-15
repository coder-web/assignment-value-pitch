
const mongoose = require('mongoose')
const response = require('../libs/responseLib');
const UserModel = mongoose.model('User');
const tokenLib = require('../libs/tokenLib');
const shortid = require('shortid');
const passwordLib = require('../libs/passwordLib');
const check = require('../libs/checkLib');


const signup = (req, res) => {
    const isEmailExist = (email) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'email': email.trim().toLowerCase() },
                (err, result) => {
                    if (err) {
                        const apiResponse = response.generate(true, 'Email find err ' + err, 400, null);
                        reject(apiResponse);
                    } else if (!check.isEmpty(result)) {
                        const apiResponse = response.generate(true, 'Email already exist', 400, null);
                        reject(apiResponse);
                    } else {
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            name: req.body.name.trim(),
                            email: req.body.email.toLowerCase().trim(),
                            password: passwordLib.hashpassword(req.body.password),
                        });
                        newUser.save((err, newUser) => {
                            if (err) {
                                const apiResponse = response.generate(true, 'Unable to create new user details', 400, null);
                                reject(apiResponse);
                            } else {
                                let newUserObj = newUser.toObject();
                                delete newUserObj.password;
                                delete newUserObj._id;
                                const apiResponse = response.generate(false, 'Signed up successfully', 200, newUserObj);
                                resolve(apiResponse);
                            }
                        })
                    }
                });
        })
    }
    const checkParameters = async (req, res) => {
        try {
            if (check.isEmpty(req.body.name) || check.isEmpty(req.body.email) || check.isEmpty(req.body.password)) {
                const apiResponse = response.generate(true, '1 or more parameters are missing', 400, null);
                res.json(apiResponse);
            } else {
                let response = await isEmailExist(req.body.email);
                res.json(response);
            }
        } catch (err) {
            res.status(err.status || 500)
            res.send(err);
        }
    }



    checkParameters(req, res);
};


const login = (req, res) => {
    const fetchUser = (email) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'email': email.trim().toLowerCase() },
                (err, result) => {
                    if (err) {
                        console.log(err)
                        const apiResponse = response.generate(true, err, 400, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(result)) {
                        let apiResponse = response.generate(true, 'Invalid Username', 400, null);
                        reject(apiResponse);
                    } else {
                        resolve(result);
                    }
                });
        });
    }; //end of fetchUser
    const validatePassword = (retrivedUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrivedUserDetails.password,
                (err, isMatch) => {
                    if (err) {
                        const apiResponse = response.generate(true, 'Login Failed', 500, null);
                        reject(apiResponse);
                    } else if (isMatch) {
                        resolve()
                    } else {
                        const apiResponse = response.generate(true, 'Wrong Password. Login Failed', 400, null)
                        reject(apiResponse)
                    }
                });
        });
    }; //end of validatePassword method

    const generateToken = (userData) =>{
       return new Promise((resolve, reject)=>{
        tokenLib.generateToken(userData, (err, tokenDetails) => {
            if (err) {
                const apiResponse = response.generate(true, 'Failed To Generate Token '+err, 500, null)
                reject(apiResponse)
            } else {
                userData.token = tokenDetails;
                userData.save((err, newTokenDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, 'Failed to generate token '+err, 500, 10);
                        reject(apiResponse);
                    } else {
                        let responseBody = {
                            authToken: newTokenDetails.authToken,
                            userDetails: tokenDetails.userDetails
                        }
                        resolve(responseBody);
                    }
                })
                let retrievedUserDetailsObj = userData.toObject()
                delete retrievedUserDetailsObj.password
                delete retrievedUserDetailsObj.__v
                delete retrievedUserDetailsObj.createdOn
                resolve(retrievedUserDetailsObj)
            }
        })
       })
    }
    const checkUserExist = async (req, res) => {
        try{
            if (check.isEmpty(req.body.email) || check.isEmpty(req.body.password)) {
                const apiResponse = response.generate(true, '1 or more parameters are missing', 400, null);
                res.json(apiResponse);
            } else {
                const user = await fetchUser(req.body.email);
                await (validatePassword(user));
                const token = await generateToken(user);
                const apiReponse = response.generate(false,'Login successfull', 200, token);
                res.json(apiReponse);
            }
        }catch (err) {
            res.status(err.status || 500)
            res.send(err);
        }
    }

    checkUserExist(req, res);
};
module.exports = {
    signup: signup,
    login: login
}