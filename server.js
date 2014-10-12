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
db.db.multipleStatements=true;
var connectionpool = mysql.createPool(db.db);

app.get('/', function(req, res) {
	res.send(db);
  
});

app.listen(80);
console.log('Listening on port 80');