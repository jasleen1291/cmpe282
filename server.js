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
	res.send(db);
	/*var connection = mysql.createConnection(db.db);
	connection.connect();
	var queryString =  
"CREATE TABLE IF NOT EXISTS `transactions` ("+
"`id` int(11) DEFAULT NULL,"+
  "`items` text,"+
  "`total` varchar(45) DEFAULT NULL,"+
  "`creditcard` varchar(45) DEFAULT NULL,"+
  "`tranDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP"+
") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
	connection.query(queryString, function(err, rows) {
	    if (err) throw res.send(err);
	 
	    res.send(rows);
	});
	 
	connection.end();
  */
});


   

app.use(express.static('public'));

app.listen(3000);
console.log('Listening on port 80');