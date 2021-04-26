const express = require('express');
const app = express();
const cron = require('node-cron');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
const http = require('http');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { base64encode, base64decode } = require('nodejs-base64');
const url1 = require('url');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todo_db');
var db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', function() {
    console.log("Connection Successful!");
});

const signup = require('./routes/user.route');

app.use("/user", signup);
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

app.get("/reset_password", function (req, res) 
{
    res.render('public/reset_password.html');
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
	
	mongoose.models = {}
	var fetch_todo_data = mongoose.model('todo_data', {
		validate_notification: { type: String }
	}, 'todo_list');

	fetch_todo_data.find({ validate_notification: 'N' }, function (err, result) {
		if (err){
			console.log(err);
		}
		else{
			console.log(result);
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

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});