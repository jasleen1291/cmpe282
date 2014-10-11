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
						m
					}
					if (rows.length > 0) {
						var query = 'Update users set lastlogin= NOW() where id= '
								+ parseInt(rows[0].id);

						connection.query(query, function(err,
								row, fields) {
							if (err) {
								return callback(err);
							}
						});
						callback(null, new User(rows[0]));

					} else {

						return callback({
							message : "Invalid Login"
						});
					}

					connection.release();
				});
		res.send("connected");
		}
		catch(err)
		{
			
			res.send("not connected");
		}
	
  
});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');