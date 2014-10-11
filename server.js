var express = require('express');
var app = express();
var mysql = require('mysql');
var connection="";
var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: process.env.AWSSecretKey,
    secretAccessKey: process.env.AWSAccessKeyId,region: 'us-west-1'});
var db = new AWS.DynamoDB();


app.get('/', function(req, res) {
	var message="";
	/*try{
		var db=require('/srv/www/cmpe281/shared/config/opsworks');
		res.json({db:db,
		key:process.env.AWSSecretKey,
		id:process.env.AWSAccessKeyId
		}
				
		);
		}
		catch(err)
		{
			
		}
	*/
	db.listTables(function(err, data) {
		if(err)
			res.json(err);
		else
		res.json(data.TableNames);
		});
  
});


   

app.use(express.static('public'));

app.listen(80);
console.log('Listening on port 80');