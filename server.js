var express = require('express');
var app = express();
var mysql = require('mysql');
var connection="";
var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId:process.env.AWSAccessKeyId ,
    secretAccessKey:process.env.AWSSecretKey ,region: 'us-west-1'});
var db = new AWS.DynamoDB();


app.get('/', function(req, res) {
	var mysql =	require('mysql');
	var db=require('/srv/www/cmpe281/shared/config/opsworks');
	var connection = mysql.createConnection({ host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 've_server', multipleStatements: true});
	
	connection.connect();
	var queryString =  
"CREATE TABLE IF NOT EXISTS `transactions` ("+
"`id` int(11) DEFAULT NULL,"+
  "`items` text,"+
  "`total` varchar(45) DEFAULT NULL,"+
  "`creditcard` varchar(45) DEFAULT NULL,"+
  "`tranDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP"+
") ENGINE=InnoDB DEFAULT CHARSET=latin1; "+
"CREATE TABLE `users` ("+
 " `id` int(11) NOT NULL AUTO_INCREMENT,"+
 " `username` varchar(100) DEFAULT NULL,"+
 " `password` varchar(45) DEFAULT NULL,"+
 " `usertype` int(11) DEFAULT '0',"+
 " `lastlogin` timestamp NULL DEFAULT '1970-01-01 08:00:01',"+
"  PRIMARY KEY (`id`)"+
") ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;";
	connection.query("Show tables;", function(err, rows) {
	    if (err) throw res.send(err);
	 
	    res.send(rows);
	});
	 
	connection.end();
  
});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');