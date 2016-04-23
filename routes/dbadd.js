//Adds the user information to user_details table

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
    
    //Query to insert user details
    mysql.query('insert into user_details(user_id,user_name,email,google,picture,gender) values("'+user.id+'","'+user.name+'","'+user.email+'","'+user.link+'","'+user.picture+'","'+user.gender+'");', function(err, result){
        if(err){
            console.log("Existing user");
        }
        mysql.end();
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("success");
        res.end();
    });
});
module.exports = app;