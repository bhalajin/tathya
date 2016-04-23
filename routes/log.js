//Gets user id and returns the activity by that user id from activity_log table

var express = require('express');
var cors = require('cors');
var app = express();
var _mysql = require('mysql');
var config = require('../config/config.js');
app.use(cors());

//MYSQL Connection
function dbconnection() {
    mysql=_mysql.createConnection(config.dbconfig);
    mysql.connect(function(err){
        if (err) {
            console.log("sqlerror : "+err);
        } else {
            console.log("connection established");
        }
    });
    mysql.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            dbconnection();
        } else {                                      
            //console.log("inside mysql.on");                                  
        }
    });  
}

//listening for put request
app.put ('/', function (req, res) {
    try {
        console.log("request user data" + (req.body));
    } catch (e) {
        console.log("in catch" + e.message);
    }
    var user = (req.body);
    dbconnection();    
    
    //Query to get activity details from activity_log table
    mysql.query('select * from activity_log where user_id = "'+ user.id +'" order by time_log DESC;', function (err, result){
        if (err) {
            console.log(err);
            mysql.end();
            res.writeHead(500, {"Content-Type":"text/plain"});
            res.write("Error in MYSQL");
            res.end();
        } else {
            mysql.end();
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.write(JSON.stringify(result));
            res.end();
        }
    });
});

module.exports = app;