var http = require('http');
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var mysql =	require('mysql');
var db=require('/srv/www/cmpe281/shared/config/opsworks');
app.get('/', function(req, res) {
	try
	{
		db.db.user="root";
	var connection = mysql.createConnection(db.db);
	
	connection.connect();
	connection.query("Show tables", function(err, rows) {
	    if (err) throw res.send(db);
	 
	    res.send(rows);
	});
	}catch(err)
	{
		console.log(err);
	}
  
});

app.listen(80);
console.log('Listening on port 80');