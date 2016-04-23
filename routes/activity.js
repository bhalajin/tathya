//insert the activity (edit or delete or add) into activity_log table.

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var _mysql = require('mysql');
var config = require('../config/config.js');
var mysql;
var no_retry = 0;


//MYSQL Connection
function dbconnection(res) {
    no_retry += 1;
    mysql=_mysql.createConnection(config.dbconfig);
    mysql.connect(function(err) {
        if (err) {
            console.log("sqlerror : "+err);
        } else {
            mysql.query('SET autocommit = '+ 0 +'', function (err2) {
                if (err2) {
                    console.log("error in disabling auto commits");
                } else {
                    console.log("disabled autocommit");
                }
            });
            mysql.query('START TRANSACTION', function (err3) {
                if (err3) {
                    console.log("error in starting transaction");
                } else {
                    console.log("start transaction");
                }
            });
        }
    });
    
    //Handles the error in mysql
    mysql.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            if (no_retry < 4) {
                dbconnection();
            } else {
                mysql.end();
                res.writeHead(500,{"Content-Type":"text/plain"});
                res.write("Database connection lost");
                res.end();
            }
        } else {                                      
            console.log("inside mysql.on");                              
        }
    });  
}

app.put('/', function (req, res) {
    no_retry = 0;
    dbconnection(res);
    var data = (req.body);
    if(typeof(data.id) != "undefined" &&  typeof(data.url) != "undefined" && typeof(data.activity) != "undefined"){
        
        //Query to insert activity intp activity_log table
        mysql.query('insert into activity_log(user_id, url, activity) values("'+ data.id +'", "'+ data.url +'", "'+ data.activity +'");', function (error, result) {
            if (error) {
                console.log(error);
                
                //Query to rollback the changes
                mysql.query('ROLLBACK', function (err1) {
                    if (err1) {
                        console.log("error in rolling back"+err1);
                    } else {
                        console.log("rollback");
                    }
                });
                mysql.end();
                res.writeHead(500,{"Content-Type":"text/plain"});
                res.write(error.message);
                res.end(); 
            } else {
                
                //Query to commit the changes in mysql 
                mysql.query('COMMIT', function (err4) {
                    if(err4) {
                        console.log("error in commit :"+err4);
                    } else {
                        mysql.end();
                        res.writeHead(200,{"Content-Type":"text/plain"});
                        res.end(); 
                    }
                });
            }
        });
    } else {
        res.writeHead(500,{"Content-Type":"text/plain"});
        res.write("Bad Request");
        res.end();
    }
});

module.exports = app;