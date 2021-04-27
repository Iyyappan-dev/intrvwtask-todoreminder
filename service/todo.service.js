var Todo = require('../model/todo.model')

/***************************Fetch TODO list Service**********************************/
exports.fetch_todo = async function (query, page, limit, req, res) {
    try {
		// console.log(req.body);
        var users = await Todo.fetch_todo(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************Insert TODO data Service**********************************/
exports.insert_todo = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await Todo.insert_todo_data(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************Delete TODO data Service**********************************/
exports.delete_todo = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await Todo.delete_todo(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************Update TODO data Service**********************************/
exports.update_todo = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await Todo.update_todo(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

/***************************Restore deleted TODO data Service**********************************/
exports.restore_todo = async function (query, page, limit, req, res) {
    try {
		console.log(req.body);
        var users = await User.restore_todo(query,req,res);
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}
