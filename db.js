
var mysql =	require('mysql');
var connectionpool = mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 've_server',
        multipleStatements: true
    });
module.exports =  connectionpool;

