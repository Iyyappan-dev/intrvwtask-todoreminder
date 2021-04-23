var express = require('express');
//var routes = require('./routes');
var app = express();
var cron = require('node-cron');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var path = require('path');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var crypto = require('crypto');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

app.use(express.static(__dirname + "/public"));

app.use(function(req,res, next){
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
	console.log('Access-Control-Allow-Origin is SET');
})

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

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

/***************************Page redirection API**********************************/
app.get("/", function (req, res) 
{
    res.render('public/index.html');
});

app.get("/open_settings", function (req, res) 
{
	var token = req.query.token;
	var decoded = jwt.verify(token, TOKEN_SECRET);
	console.log(decoded.foo)
    res.render('public/settings.html');
});

app.get("/open_home", function (req, res) 
{
	var token = req.query.token;
	var decoded = jwt.verify(token, TOKEN_SECRET);
	console.log(decoded.foo)
    res.render('public/home.html');
});

app.get("/open_todo", function (req, res) 
{
	var token = req.query.token;
	var decoded = jwt.verify(token, TOKEN_SECRET);
	console.log(decoded.foo)
    res.render('public/todo.html');
});

app.get("/open_exp_task", function (req, res) 
{
	var token = req.query.token;
	var decoded = jwt.verify(token, TOKEN_SECRET);
	console.log(decoded.foo)
    res.render('public/expired_task.html');
});

app.get("/open_trash", function (req, res) 
{
	var token = req.query.token;
	var decoded = jwt.verify(token, TOKEN_SECRET);
	console.log(decoded.foo)
    res.render('public/trash.html');
});

/***************************User Login API**********************************/
app.post("/user_login", function (req, res) {
    var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	const token = generateAccessToken({ username: req.body.user_id });
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("microservice_db");

		var query = {"user_id": user_id};

		console.log(query);

		dbo.collection("login_users").find(query).toArray(function(err, result)
		{
			if (err) throw err;
			if(result.length > 0)
			{
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
		})
	})
});

/***************************Signup API**********************************/
app.post("/user_signup", function (req, res) {
    var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	var user_data = [];
	
	user_data.push({user_id:user_id,user_password:user_password});
	// var myobj = { user_id:user_id, user_password:user_password };
	
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("microservice_db");

		var query = {"user_id": user_id};

		console.log(query);

		dbo.collection("login_users").find(query).toArray(function(err, result)
		{
			if (err) throw err;
			if(result.length > 0)
			{
				res.sendStatus(501);
			}
			else
			{
				sign_up(req, res);
			}
		})
	})
});

function sign_up(req, res)
{
	var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	var user_data = [];
	user_data.push({user_id:user_id,user_password:user_password});
	
	MongoClient.connect(url, function(err, db)
	{
		if (err) throw err;
		var dbo = db.db("microservice_db");
		// console.log(user_data);
		dbo.collection("login_users").insertMany(user_data, function(err, resp)
		{
			if (err) throw err;

			console.log(resp.insertedCount+" Other documents inserted");
			db.close();
			res.sendStatus(200);
		})
	})
}

/***************************User Verfication API to update the password**********************************/
app.post("/verify_user", function (req, res) {
    var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	var token = req.body.token;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("microservice_db");

		var query = {"user_id": user_id};

		console.log(query);

		dbo.collection("login_users").find(query).toArray(function(err, result)
		{
			if (err) throw err;
			if(result.length > 0)
			{
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
		})
	})
});

/***************************Password updation API**********************************/
app.post("/update_pwd", function (req, res) {
    var user_id=req.body.user_id;
	var user_password=req.body.user_password;
	var token = req.body.token;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("microservice_db");

		var myquery = { user_id: user_id};
		var newvalues = { $set: { user_id: user_id, user_password: user_password } };
		
		dbo.collection("login_users").updateOne(myquery, newvalues, function(err, resp) 
		{
			if (err) throw err;
			console.log("1 document updated");
			db.close();
			res.sendStatus(200);
		});
	})
});

/***************************Forgot password API**********************************/
app.post("/forgot_password", function (req, res) {
    var user_id=req.body.user_id;
	
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("microservice_db");

		var query = {"user_id": user_id};

		console.log(query);

		dbo.collection("login_users").find(query).toArray(function(err, result)
		{
			if (err) throw err;
			if(result.length > 0)
			{
				var mailOptions={
					to : user_id,
					from: 'no-reply@microservice.com',
					subject: 'Forgot Password',
					html: 'Dear User,<br>Your password is <b>'+ result[0].user_password +'<b>',				
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
			}
			else
			{
				res.sendStatus(501);
			}
		});
	})
});

/***************************Insert TODO data API**********************************/
app.post("/insert_todo", function (req, res) {
    var user_id=req.body.user_id;
	var task_name=req.body.task_name;
	var task_type=req.body.task_type;
	var expiry_date=req.body.expiry_date;
	var schedule_date=req.body.schedule_date;
	var token=req.body.token;
	var id = crypto.randomBytes(20).toString('hex');
	var random_string = id.substring(0, 30);
	var user_data = [];
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
	var decoded = jwt.verify(token, TOKEN_SECRET);
	
	user_data.push({user_id:user_id,task_name:task_name,task_type:task_type,expiry_date:expiry_date,task_status:'Yet To Start',task_id:random_string,today_date:today_date,validate_notification:'N',schedule_date:schedule_date});
	
	MongoClient.connect(url, function(err, db)
	{
		if (err) throw err;
		var dbo = db.db("microservice_db");
		dbo.collection("todo_list").insertMany(user_data, function(err, resp)
		{
			if (err) throw err;

			console.log(resp.insertedCount+" Other documents inserted");
			
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
		})
	})
});

/***************************Fetch TODO list API**********************************/
app.post("/fetch_todo", function (req, res) {
    var user_id=req.body.user_id;
	var token=req.body.token;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	
	var query = {"user_id": user_id};
	MongoClient.connect(url, function(err, db)
	{
		if (err) throw err;
		var dbo = db.db("microservice_db");
		dbo.collection("todo_list").find(query).toArray(function(err, result)
		{
			if (err) throw err;
			res.send(result);
		})
	})
});

/***************************Fetch trash bin data API**********************************/
app.post("/fetch_trash_data", function (req, res) {
    var user_id=req.body.user_id;
	var token=req.body.token;
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	
	var query = {"user_id": user_id};
	MongoClient.connect(url, function(err, db)
	{
		if (err) throw err;
		var dbo = db.db("microservice_db");
		dbo.collection("trash_bin_list").find(query).toArray(function(err, result)
		{
			if (err) throw err;
			res.send(result);
		})
	})
});

/***************************Delete TODO data API**********************************/
app.post("/delete_todo", function (req, res) {
    var user_id=req.body.user_id;
	var task_id=req.body.task_id;
	var token=req.body.token;
	var user_data = [];
	var decoded = jwt.verify(token, TOKEN_SECRET);
	var query = {"user_id": user_id,'task_id': task_id};
	MongoClient.connect(url, function(err, db)
	{
		if (err) throw err;
		var dbo = db.db("microservice_db");
		dbo.collection("todo_list").find(query).toArray(function(err, result)
		{
			if (err) throw err;
			if(result.length > 0)
			{
				user_data.push({user_id:result[0].user_id,task_name:result[0].task_name,task_type:result[0].task_type,expiry_date:result[0].expiry_date,task_status:result[0].task_status,task_id:result[0].task_id,today_date:result[0].today_date,validate_notification:result[0].validate_notification,schedule_date:result[0].schedule_date});
				
				db.close();
				
				MongoClient.connect(url, function(err, db)
				{
					if (err) throw err;
					var dbo = db.db("microservice_db");
					dbo.collection("trash_bin_list").insertMany(user_data, function(err, resp)
					{
						if (err) throw err;
						console.log(resp.insertedCount+" Other documents inserted");
						
						db.close();
						
						var query = {"user_id": user_id,'task_id': task_id};
						MongoClient.connect(url, function(err, db)
						{
							if (err) throw err;
							var dbo = db.db("microservice_db");
							dbo.collection("todo_list").deleteOne(query, function(err, obj)
							{
								if (err) throw err;
								console.log("1 document deleted");
								db.close();
								res.sendStatus(200);
							})
						})
					})
				})
			}
			else
			{
				res.sendStatus(501);
			}
		})
	})
});

/***************************Restore deleted TODO data API**********************************/
app.post("/restore_todo", function (req, res) {
    var user_id=req.body.user_id;
	var task_id=req.body.task_id;
	var token=req.body.token;
	var user_data = [];
	var decoded = jwt.verify(token, TOKEN_SECRET);
	var query = {"user_id": user_id,'task_id': task_id};
	MongoClient.connect(url, function(err, db)
	{
		if (err) throw err;
		var dbo = db.db("microservice_db");
		dbo.collection("trash_bin_list").find(query).toArray(function(err, result)
		{
			if (err) throw err;
			if(result.length > 0)
			{
				user_data.push({user_id:result[0].user_id,task_name:result[0].task_name,task_type:result[0].task_type,expiry_date:result[0].expiry_date,task_status:result[0].task_status,task_id:result[0].task_id,today_date:result[0].today_date,validate_notification:result[0].validate_notification,schedule_date:result[0].schedule_date});
				
				db.close();
				
				MongoClient.connect(url, function(err, db)
				{
					if (err) throw err;
					var dbo = db.db("microservice_db");
					dbo.collection("todo_list").insertMany(user_data, function(err, resp)
					{
						if (err) throw err;
						console.log(resp.insertedCount+" Other documents inserted");
						
						db.close();
						
						var query = {"user_id": user_id,'task_id': task_id};
						MongoClient.connect(url, function(err, db)
						{
							if (err) throw err;
							var dbo = db.db("microservice_db");
							dbo.collection("trash_bin_list").deleteOne(query, function(err, obj)
							{
								if (err) throw err;
								console.log("1 document deleted");
								db.close();
								res.sendStatus(200);
							})
						})
					})
				})
			}
			else
			{
				res.sendStatus(501);
			}
		})
	})
});

/***************************Update TODO data API**********************************/
app.post("/update_todo", function (req, res) {
    var user_id=req.body.user_id;
	var task_name=req.body.task_name;
	var task_type=req.body.task_type;
	var task_status=req.body.task_status;
	var expiry_date=req.body.expiry_date;
	var schedule_date=req.body.schedule_date;
	var token=req.body.token;
	var task_id=req.body.task_id;
	var id = crypto.randomBytes(20).toString('hex');
	var random_string = id.substring(0, 30);
	var user_data = [];
	
	var decoded = jwt.verify(token, TOKEN_SECRET);
	
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("microservice_db");

		var myquery = { user_id: user_id,task_id: task_id};
		var newvalues = { $set: { user_id: user_id, task_name: task_name, task_type: task_type, expiry_date: expiry_date, task_status: task_status, task_id: task_id, schedule_date:schedule_date} };
		
		dbo.collection("todo_list").updateOne(myquery, newvalues, function(err, resp) 
		{
			if (err) throw err;
			console.log("1 document updated");
			db.close();
			res.sendStatus(200);
		});
	})
});
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
	var query = {"validate_notification": "N"};
	MongoClient.connect(url, function(err, db)
	{
		if (err) throw err;
		var dbo = db.db("microservice_db");
		dbo.collection("todo_list").find(query).toArray(function(err, result)
		{
			if (err) throw err;
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
					console.log('Not Today');
					console.log(task_id);
				}
			}
			db.close();
		})
	})
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});