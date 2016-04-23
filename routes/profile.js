//Gets the user id and returns the user information from user_details table

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var _mysql = require('mysql');
var config = require('../config/config.js');

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
app.put('/', function (req, res) { 
    dbconnection();
    var userinfo = req.body;
    
    //Query to Get user details
     mysql.query('SELECT * FROM user_details WHERE user_id = "'+userinfo.id+'";', function(err, rows, fields){
         if (err) {
                console.log(err);
                mysql.end();
                res.writeHead(200,{"Content-Type":"text/plain"});
                res.write("Error in MYSQL");
                res.end(); 
            }else {
                rows[0].id = rows[0].user_id;
                rows[0].name = rows[0].user_name;
                rows[0].link = rows[0].google;
                mysql.end();
                res.writeHead(200,{"Content-Type":"text/plain"});
                res.write(JSON.stringify(rows[0]));
                res.end(); 
            }    
   });
    
});
module.exports = app;