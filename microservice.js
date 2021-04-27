const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
const http = require('http');
const jwt = require('jsonwebtoken');
var db = require('./config/db');
const signup = require('./routes/user.route');
app.use("/user", signup);
app.use(express.static(__dirname + "/public"));

/***************************JWT Token Generator**********************************/
var TOKEN_SECRET = 'dhw782wujnd99ahmmakhanjkajikhiwn2n';

function generateAccessToken(username) {
	console.log();
	return jwt.sign(username, TOKEN_SECRET);
}

/***************************CORS**********************************/
app.use(function(req,res, next){
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
	console.log('Access-Control-Allow-Origin is SET');
})

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

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

/******************************************************************************************/
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});