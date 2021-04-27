var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sgTransport = require('nodemailer-sendgrid-transport');
const cron = require('node-cron');
var encrypt = require('../config/encryption');
const nodemailer = require('nodemailer');

/***************************Mail Notification Setup**********************************/

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: "ayyappaniyyappan75@gmail.com",
		pass: "7871433886!"
	}
});
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
				
				let encrypt_password = encrypt.encrypt(user_password);
	
				var signup = mongoose.model('login', signup_data, 'login_user');
				var new_signup = new signup({ user_id: user_id, user_password: encrypt_password });
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
				result[0].user_password = encrypt.decrypt(result[0].user_password);
				console.log(result[0].user_password);
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
				result[0].user_password = encrypt.decrypt(result[0].user_password);
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
	}, 'login_user');
	
	let encrypt_password = encrypt.encrypt(user_password);
	Cat.findOneAndUpdate({user_id: user_id}, {$set:{user_password:encrypt_password}}, {new: true}, (err, doc) => {
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
		from: 'no-reply@gmail.com',
		subject: 'Forgot Password',
		html: 'Dear User,<br>Click the below link to reset the password<br><a href="http://localhost:3000/reset_password?user_id='+ user_id +'">Reset Password</a>',				
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
	console.log(req.body);
	mongoose.models = {}
	var Cat = mongoose.model('Cat', {
		user_id: String,
		user_password: String
	}, 'login_user');
	
	let encrypt_password = encrypt.encrypt(user_password);
	Cat.findOneAndUpdate({user_id: user_id}, {$set:{user_password:encrypt_password}}, {new: true}, (err, doc) => {
		if (err) {
			console.log(err);
		}
		else
		{
			res.sendStatus(200);
		}
	});
}

/***************************Corn API call**********************************/

cron.schedule('* * * * *', function() {
  console.log('running a task every minute');
  fetch_todo();
});

function fetch_todo()
{
	var today_date = new Date();
	var dd = today_date.getDate();
	var mm = today_date.getMonth() + 1; //January is 0!
	var yyyy = today_date.getFullYear();

	if (dd < 10) {
	  dd = '0' + dd;
	}

	if (mm < 10) {
	  mm = '0' + mm;
	}

	today_date = dd + '/' + mm + '/' + yyyy;
	
	mongoose.models = {}
	var fetch_todo_data = mongoose.model('todo_data', {
		validate_notification: { type: String }
	}, 'todo_list');

	fetch_todo_data.find({ validate_notification: 'N' }, function (err, result) {
		if (err){
			console.log(err);
		}
		else{
			console.log(today_date);
			for(var i=0;i<result.length;i++)
			{
				
				if(result[i].schedule_date == today_date)
				{
					var user_id = result[i].user_id;
					var task_id = result[i].task_id;
					console.log(i);
					if(result[i].validate_notification == "N")
					{
						console.log('*********************');
						var mailOptions={
							to : result[i].user_id,
							from: 'no-reply@microservice.com',
							subject: 'TODO LIST REMAINDER',
							html: 'Dear User,<br>Your Todo list is<br><table border="1"><thead><tr><th>Task Name</th><th>Task Type</th><th>Task Status</th><th>Creation Date</th><th>Schedule Date</th><th>Expiry Date</th></tr></thead><tbody><tr><td>'+result[i].task_name+'</td><td>'+result[i].task_type+'</td><td>'+result[i].task_status+'</td><td>'+result[i].today_date+'</td><td>'+result[i].schedule_date+'</td><td>'+result[i].expiry_date+'</td></tr></tbody></table>',				
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
								MongoClient.connect(url, function(err, db) {
									if (err) throw err;
									var dbo = db.db("microservice_db");
									// console.log(user_id);
									console.log(i);
									var myquery = { user_id: user_id,task_id: task_id};
									var newvalues = { $set: { validate_notification:'Y' } };
									
									dbo.collection("todo_list").updateOne(myquery, newvalues, function(err, resp) 
									{
										if (err) throw err;
										console.log("1 document updated");
										db.close();
										// res.sendStatus(200);
									});
								})
							}
						})
					}
				}
				else
				{
					console.log('Not today');
				}
			}
		}
	})
}

/***************************END**********************************/