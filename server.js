var express = require('express');
var app = express();
var mysql = require('mysql');
var connection="";


app.get('/', function(req, res) {
	var message="";
	try{
		var db=require('/srv/www/cmpe281/shared/config/opsworks');
		connection=(mysql.createConnection(db.db));
		connection
		.query(
				'SHOW TABLES',
				function(err, rows, fields) {
					if (err) {
						message=message+err;
					}
					
					else {
						message=rows;
						
					}

					res.send(message);
				});
		
		}
		catch(err)
		{
			
			res.send("not connected");
		}
	
  
});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');