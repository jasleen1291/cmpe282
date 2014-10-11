var express = require('express');
var app = express();
var mysql = require('mysql');
var connection="";


app.get('/', function(req, res) {
	try{
		var db=require('/srv/www/cmpe281/shared/config/opsworks');
		connection=(mysql.createConnection(db.db));
		res.send("connected");
		}
		catch(err)
		{
			res.send("not connected");
		}
	
  
});


   

app.use(express.static('public'));

app.listen(3000);
console.log('Listening on port 80');