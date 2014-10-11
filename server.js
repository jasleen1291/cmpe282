var express = require('express');
var app = express();
var mysql = require('mysql');
var db=require('./shared/config/opsworks');
var connection=(mysql.createConnection(db.db));
app.get('/', function(req, res) {
   res.json({message:"Hello Worlds"});
   connection.query('CREATE TABLE if not exists `transactions`  ( 		  `id` int(11) DEFAULT NULL,		  `items` text,		  `total` varchar(45) DEFAULT NULL,		  `creditcard` varchar(45) DEFAULT NULL,		  `tranDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP		) ',
			function(err,rows)     {
	    
	    if(err)
	       res.send("Error Selecting : %s ",err );
	 
	    res.send('customers',{page_title:"Customers - Node.js",data:rows});
	                       
	     });
});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');