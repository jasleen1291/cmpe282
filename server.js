var express = require('express');
var app = express();
var mysql = require('mysql');
var db=require('./shared/config/opsworks');
var connection=(mysql.createConnection(db.db));
app.get('/', function(req, res) {
 res.send(connection);
  
});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');