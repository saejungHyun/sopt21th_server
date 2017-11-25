const express = require('express');
const async = require('async');
const router = express.Router();
const pool = require('../config/dbpool');
const mysql = require('mysql');
const jwt = require('jasonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.post('/', function(req, res){
	let task_array = [

		function(callback){
			pool.getConnection(function(err, connection){
				if(err) callback("getConnecntion error at login: " + err, null);
				else callback(null, connection);
			});
		},

		function(connection, callback){
			let userinfoQuery = 'select user_email, user_pwd from users where users.user_email=? ';
			connection.query(userinfoQuery, req.body.mail, function(err,userdata){
				if(err){
					connection.release();
					callback("1st query err at login : "+err, null);
				}
				else callback(null, userdata, connection);
			});
		},

		function(userdata, connection, callback){
			if(userdata.length===0){
				connection.release();
				res.status(401).send({
					msg : "not exist user info"
				});
				callback("not exist user info", null);
				}
			else{
				bcrypt.compare(req.body.pwd, userdata[0].user_pwd, function(err, login){
					if(err) callback("password compare error : "+ err,null);
					else{
						if(login){
							callback(null, userdata[0].user_mail, connection);
						}
						else{
							connection.release();
							res.status(401).send({
								msg : "wrong password"
							});
							callback("wrong password", null);
						}
					}
				});
			}
		},

		function(userEmail, connection, callback){
			const secret = req.app.get('jwt-secret');
			console.log(secret);
			console.log(userEmail);
			let option = {
				algorithm : 'HS256',
				expiresIn : 3600 * 24 * 10
			};
			let payload = {
				user_mail :userEmail
			};
			let token = jwt.sign(payload, req.app.get('jwt-secret'), option);
			res.status(201).send(
				{
					msg : "Success",
					token : token
				});
			connection.release();
			callback(null, "successful login");
		}
	];
	async.waterfall(task_array, function(err, result) {
		if(err) console.log(err);
		else console.log(result);
	});
	});

	module.exports = router;
