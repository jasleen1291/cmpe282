var express = require('express');
var app = express();
var mysql = require('mysql');
var connection="";


app.get('/', function(req, res) {
	try{
		var db=require('./shared/config/opsworks');
		connection=(mysql.createConnection(db.db));
		}
		catch(err)
		{
			connection=err;
		}
	res.send(connection);
  
});


   

app.use(express.static('public'));

app.listen(3000);
console.log('Listening on port 80');