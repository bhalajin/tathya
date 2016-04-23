//updates the user information in the user_details table

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var _mysql = require('mysql');
var solr_add = require('./solr_add.js');
var config = require('../config/config.js');

//MYSQL Connection
function dbconnection() {
    mysql=_mysql.createConnection(config.dbconfig);
    mysql.connect(function(err){
        if (err) {
            console.log("sqlerror : "+err);
        } else {
            //console.log("connection established");
        }
    });
    mysql.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            dbconnection();
        } else {                                      
            console.log("inside mysql.on");                                  
        }
    });  
}


app.put('/', function (req, res) {
    dbconnection();
    var user = req.body;
    
    //Query to update user profile in user_details table
    mysql.query('update user_details set linkedin = "'+user.linkedin+'", location = "'+user.location+'", jobtitle = "'+user.jobtitle+'", department = "'+user.department+'", phoneno = "'+user.phoneno+'" where user_id = "'+ user.id +'";', function (err, result) {
        if (err) {
            console.log("Existing user"+err);  
            mysql.end();
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.write("SQL error");
            res.end();
        } else {
            mysql.end();
            res.writeHead(200,{"Content-Type":"text/plain"});
            res.write("success");
            res.end();
        }
    });
});   
module.exports = app;