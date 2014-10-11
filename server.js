var express = require('express');
var app = express();
var mysql = require('mysql');
var connection="";


app.get('/', function(req, res) {
	var message="";
	
		var db=require('/srv/www/cmpe281/shared/config/opsworks');
		res.send(db);

});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');