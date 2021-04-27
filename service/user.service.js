var User = require('../model/user.model')

/***************************Signup Service**********************************/
exports.signUp = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await User.signUp(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************User Login Service**********************************/
exports.login = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await User.login(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************User Verfication Service to update the password**********************************/
exports.verify_user = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await User.verify_user(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************Password updation Service**********************************/
exports.update_pwd = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await User.update_pwd(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************Forgot password Service**********************************/
exports.forgot_password = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await User.forgot_password(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************Update email password Service**********************************/
exports.update_user_pwd = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await User.update_user_pwd(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}
