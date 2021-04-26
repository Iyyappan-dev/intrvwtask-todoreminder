const express = require('express');
let router = express.Router();
var UserController = require('../controllers/user.controller')

/***************************Signup Routing**********************************/
	
router.post('/signup', UserController.signUp)
	
/***************************User Login Routing**********************************/

router.post('/login', UserController.login)

/***************************Fetch TODO list Routing**********************************/

router.post('/fetch_todo', UserController.fetch_todo)

/***************************Insert TODO data Routing**********************************/

router.post('/insert_todo', UserController.insert_todo)

/***************************Delete TODO data Routing**********************************/

router.post('/delete_todo', UserController.delete_todo)

/***************************Update TODO data Routing**********************************/

router.post('/update_todo', UserController.update_todo)

/***************************Restore deleted TODO data Routing**********************************/

router.post('/restore_todo', UserController.restore_todo)

/***************************User Verfication Routing to update the password**********************************/

router.post('/verify_user', UserController.verify_user)

/***************************Password updation Routing**********************************/

router.post('/update_pwd', UserController.update_pwd)

/***************************Forgot password Routing**********************************/

router.post('/forgot_password', UserController.forgot_password)

/***************************Update email password Routing**********************************/

router.post('/update_user_pwd', UserController.update_user_pwd)

module.exports = router;