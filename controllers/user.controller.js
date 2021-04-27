var UserService = require('../service/user.service')

/***************************Signup Function**********************************/
exports.signUp = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await UserService.signUp({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}

/***************************User Login Function**********************************/
exports.login = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await UserService.login({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}

/***************************User Verfication Function to update the password**********************************/
exports.verify_user = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await UserService.verify_user({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}

/***************************Password updation Function**********************************/
exports.update_pwd = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await UserService.update_pwd({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}

/***************************Forgot password Function**********************************/
exports.forgot_password = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await UserService.forgot_password({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}

/***************************Update email password Function**********************************/
exports.update_user_pwd = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await UserService.update_user_pwd({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}