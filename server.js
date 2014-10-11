var express = require('express');
var app = express();
var mysql = require('mysql');
var connection="";
try{
var db=require('/srv/www/cmpe281/shared/config/opsworks');
connection=(mysql.createConnection(db.db));
}
catch(err)
{
	
}

app.get('/', function(req, res) {
 res.send(connection);
  
});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');