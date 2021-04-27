var TodoService = require('../service/todo.service')

/***************************Fetch TODO list Function**********************************/
exports.fetch_todo = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await TodoService.fetch_todo({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}

/***************************Insert TODO data Function**********************************/
exports.insert_todo = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await TodoService.insert_todo({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}	

/***************************Delete TODO data Function**********************************/
exports.delete_todo = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await TodoService.delete_todo({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}

/***************************Update TODO data Function**********************************/
exports.update_todo = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await TodoService.update_todo({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}

/***************************Restore deleted TODO data Function**********************************/
exports.restore_todo = async function (req, res, next) {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : 10;
	try {
		var users = await TodoService.restore_todo({}, page, limit, req, res)
	} catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
}
