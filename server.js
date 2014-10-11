var express = require('express');
var app = express();
var mysql = require('mysql');
var connection="";


app.get('/', function(req, res) {
	var message="";
	try{
		
		connection=(mysql.createConnection({
	        host     : 'localhost',
	        user     : 'root',
	        password : 'root',
	        database : 've_server'
	    }));
		connection
		.query(
				'SHOW TABLES',
				function(err, rows, fields) {
					if (err) {
						message=err;
					}
					else{
						message=rows;
					}

					connection.release();
				});
		res.send(message);
		}
		catch(err)
		{
			
			res.send("not connected");
		}
	
  
});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');