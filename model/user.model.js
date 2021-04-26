var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const { base64encode, base64decode } = require('nodejs-base64');

let encoded = base64encode('hey there'); // "aGV5ICB0aGVyZQ=="
let decoded = base64decode(encoded); // "hey there"

/***************************Mail Notification Setup**********************************/
var sgoptions = {
    auth: {
        api_key: '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'
    }
};

var transporter = nodemailer.createTransport(sgTransport(sgoptions));

/***************************JWT Token Generator**********************************/
var TOKEN_SECRET = 'dhw782wujnd99ahmmakhanjkajikhiwn2n';

function generateAccessToken(username) {
	console.log();
	return jwt.sign(username, TOKEN_SECRET);
}

/***************************Signup API**********************************/
exports.signUp = async function (query, req, res) {
	var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	
	mongoose.models = {}
	const signUp = mongoose.model('signup_data', {
		user_id: { type: String },
		user_password: { type: String }
	}, 'login_user');
	
	signUp.find({ user_id: user_id}, function (err, result) {
		if (err){
			console.log(err);
		}
		else{
			if(result.length > 0)
			{
				res.sendStatus(501);
			}
			else
			{
				var signup_data = mongoose.Schema({
				  user_id: String,
				  user_password: String
				});
				
				let encoded = base64encode(user_password);
				var signup = mongoose.model('login', signup_data, 'login_user');
				var new_signup = new signup({ user_id: user_id, user_password: encoded });
				new_signup.save(function (err, book) {
				  if (err) return console.error(err);
				  res.sendStatus(200);
				});
			}
		}
	});
}

/***************************User Login API**********************************/
exports.login = async function (query, req, res) {
	var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	
	const token = generateAccessToken({ username: req.body.user_id });
	
	mongoose.models = {}
	const signUp = mongoose.model('login_data', {
		user_id: { type: String },
		user_password: { type: String }
	}, 'login_user');

	signUp.find({ user_id: user_id}, function (err, result) {
		if (err){
			console.log(err);
		}
		else{
			if(result.length > 0)
			{
				user_password = base64encode(user_password);
				if(result[0].user_id == user_id)
				{
					if(result[0].user_password == user_password)
					{
						res.json(token);
					}
					else
					{
						res.sendStatus(502);
					}
				}
				else
				{
					res.sendStatus(501);
				}
			}
			else
			{
				res.sendStatus(501);
			}
		}
	})
}

/***************************Fetch TODO list API**********************************/
exports.fetch_todo = async function (query, req, res) {
	var user_id=req.body.user_id;
	var token=req.body.token;
	var decoded = jwt.verify(token, TOKEN_SECRET);
	
	mongoose.models = {}
	var fetch_todo_data = mongoose.model('todo_data', {
		user_id: { type: String }
	}, 'todo_list');

	fetch_todo_data.find({ user_id: user_id }, function (err, result) {
		if (err){
			console.log(err);
		}
		else{
			res.send(result);
		}
	})
}

/***************************Insert TODO data API**********************************/
exports.insert_todo_data = async function (query, req, res) {
	var user_id=req.body.user_id;
	var task_name=req.body.task_name;
	var task_type=req.body.task_type;
	var expiry_date=req.body.expiry_date;
	var schedule_date=req.body.schedule_date;
	var token=req.body.token;
	var id = crypto.randomBytes(20).toString('hex');
	var random_string = id.substring(0, 30);
	var today_date = new Date();
	var dd = today_date.getDate();
	var mm = today_date.getMonth() + 1; //January is 0!
	var yyyy = today_date.getFullYear();
	var task_data = [];
	var task_flag = [];

	if (dd < 10) {
	  dd = '0' + dd;
	}

	if (mm < 10) {
	  mm = '0' + mm;
	}

	today_date = dd + '/' + mm + '/' + yyyy;
	var decoded = jwt.verify(token, TOKEN_SECRET);
	
	mongoose.models = {}
	
	var todo_data = mongoose.Schema({
	  user_id: String,
	  task_id: String,
	  task_name: String,
	  task_type: String,
	  task_status: String,
	  expiry_date: String,
	  today_date: String,
	  schedule_date: String,
	  validate_notification: String,
	  trash_data:String
	});
	
	var todo = mongoose.model('insert_todo_user_data', todo_data, 'todo_list');
	var new_todo = new todo({ user_id: user_id, task_id: random_string, task_name: task_name, task_type: task_type, task_status: 'Yet To Start', expiry_date: expiry_date, today_date: today_date, schedule_date: schedule_date, validate_notification: 'N', trash_data: 'N' });
	
	new_todo.save(function (err, book) {
		if (err) return console.error(err);
		var mailOptions={
			to : user_id,
			from: 'no-reply@microservice.com',
			subject: 'TODO LIST',
			html: 'Dear User,<br>Your Todo list is<br><table border="1"><thead><tr><th>Task Name</th><th>Task Type</th><th>Task Status</th><th>Creation Date</th><th>Schedule Date</th><th>Expiry Date</th></tr></thead><tbody><tr><td>'+task_name+'</td><td>'+task_type+'</td><td>Yet To Start</td><td>'+today_date+'</td><td>'+schedule_date+'</td><td>'+expiry_date+'</td></tr></tbody></table>',				
		}
		console.log(mailOptions);
		transporter.sendMail(mailOptions, function(error, resp)
		{
			if(error)
			{
				console.log('Email error: ' + error);
				res.sendStatus(500);
			}
			else
			{
				res.sendStatus(200);
			}
		})
	});
}

/***************************Delete TODO data API**********************************/
exports.delete_todo = async function (query, req, res) {
	var user_id=req.body.user_id;
	var task_id=req.body.task_id;
	var token=req.body.token;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	mongoose.models = {}
	var Cat = mongoose.model('Cat', {
		task_id: String,
		trash_data: String
	}, 'todo_list');
	
	Cat.findOneAndUpdate({task_id: task_id}, {$set:{trash_data:"Y"}}, {new: true}, (err, doc) => {
		if (err) {
			console.log("Something wrong when updating data!");
		}
		else
		{
			res.sendStatus(200);
		}
	});
}

/***************************Update TODO data API**********************************/
exports.update_todo = async function (query, req, res) {
	var user_id=req.body.user_id;
	var task_name=req.body.task_name;
	var task_type=req.body.task_type;
	var task_status=req.body.task_status;
	var expiry_date=req.body.expiry_date;
	var schedule_date=req.body.schedule_date;
	var token=req.body.token;
	var task_id=req.body.task_id;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	mongoose.models = {}
	var Cat = mongoose.model('Cat', {
		task_id: String,
		task_name: String,
		user_id: String,
		task_type: String,
		task_status: String,
		expiry_date: String,
		schedule_date: String
	}, 'todo_list');
	
	Cat.findOneAndUpdate({task_id: task_id}, {$set:{task_name:task_name,task_type:task_type,task_status:task_status,expiry_date:expiry_date,schedule_date:schedule_date}}, {new: true}, (err, doc) => {
		if (err) {
			console.log("Something wrong when updating data!");
		}
		else
		{
			res.sendStatus(200);
		}
	});
}

/***************************Restore deleted TODO data API**********************************/
exports.restore_todo = async function (query, req, res) {
	var user_id=req.body.user_id;
	var task_id=req.body.task_id;
	var token=req.body.token;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	mongoose.models = {}
	var Cat = mongoose.model('Cat', {
		task_id: String,
		trash_data: String
	}, 'todo_list');
	
	Cat.findOneAndUpdate({task_id: task_id}, {$set:{trash_data:"N"}}, {new: true}, (err, doc) => {
		if (err) {
			console.log("Something wrong when updating data!");
		}
		else
		{
			res.sendStatus(200);
		}
	});
}

/***************************User Verfication API to update the password**********************************/
exports.verify_user = async function (query, req, res) {
	var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	var token = req.body.token;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	mongoose.models = {}
	const signUp = mongoose.model('signup_data', {
		user_id: { type: String },
		user_password: { type: String }
	}, 'login_user');
	
	signUp.find({ user_id: user_id}, function (err, result) {
		if (err){
			console.log(err);
		}
		else{
			if(result.length > 0)
			{
				user_password = base64encode(user_password);
				if(result[0].user_id == user_id)
				{
					if(result[0].user_password == user_password)
					{
						res.sendStatus(200);
					}
					else
					{
						res.sendStatus(502);
					}
				}
				else
				{
					res.sendStatus(501);
				}
			}
			else
			{
				res.sendStatus(501);
			}
		}
	})
}

/***************************Password API Function**********************************/
exports.update_pwd = async function (query, req, res) {
	var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	var token = req.body.token;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	mongoose.models = {}
	var Cat = mongoose.model('Cat', {
		user_id: String,
		user_password: String
	}, 'todo_list');
	
	let encoded = base64encode(user_password);
	Cat.findOneAndUpdate({user_id: user_id}, {$set:{user_password:encoded}}, {new: true}, (err, doc) => {
		if (err) {
			console.log("Something wrong when updating data!");
		}
		else
		{
			res.sendStatus(200);
		}
	});
}

/***************************Forgot password API**********************************/
exports.forgot_password = async function (query, req, res) {
	var user_id=req.body.user_id;
	
	var mailOptions={
		to : user_id,
		from: 'no-reply@todo.com',
		subject: 'Forgot Password',
		html: 'Dear User,<br>Click the below link to reset the password<br><a href="http://localhost:3000/reset_password">Reset Password</a>',				
	}
	console.log(mailOptions);
	transporter.sendMail(mailOptions, function(error, resp)
	{
		if(error)
		{
			console.log('Email error: ' + error);
			res.sendStatus(500);
		}
		else
		{
			console.log("Email Success");
			res.sendStatus(200);
		}
	})
}
/***************************Update email password API**********************************/
exports.update_user_pwd = async function (query, req, res) {
	var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	
	mongoose.models = {}
	var Cat = mongoose.model('Cat', {
		user_id: String,
		user_password: String
	}, 'todo_list');
	
	let encoded = base64encode(user_password);
	Cat.findOneAndUpdate({user_id: user_id}, {$set:{user_password:encoded}}, {new: true}, (err, doc) => {
		if (err) {
			console.log("Something wrong when updating data!");
		}
		else
		{
			res.sendStatus(200);
		}
	});
}
