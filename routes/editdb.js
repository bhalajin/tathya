//Updates the keywords in the URL table.

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
    var url = req.body;
  
    //Query to delete from url_details
    mysql.query('update url_details set keywords = "'+ url.keywords +'" where url = "'+url.url+'" and user_id = "'+url.user_id+'";',function (err,result) {
        if(err){
            console.log("Error in SQL");
            mysql.end();
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.write("MySQL error");
            res.end();
        }
        else {
            //Query to insert into url_details
                mysql.end();
                res.writeHead(200,{"Content-Type":"text/plain"});
                res.write("success");
                res.end();
        }       
    });
});
module.exports = app;