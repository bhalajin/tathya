//Adds the user id,url and keywords to the url_details table. If already exists,append the keywords
//Call comes from plugin

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var _mysql = require('mysql');
var solr_add = require('./solr_add.js');
var config = require('../config/config.js');
var unique = require('unique-words');

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
    var array = [];  //stores the url and keywords
    var user_array = []; //used to store the user information
    dbconnection();
    var arr = req.body;
    var user = JSON.parse(arr.user_info);
    mysql.query('select * from url_details where url = "'+arr.url+'"and user_id ="'+user.id+'";',function(err,result){
        if(err) {
            console.log("Error in SQL"+err);
            mysql.end();
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.write("Error in SQL");
            res.end(); 
        }
        else{
            if(typeof(result[0].keywords) != "undefined"){
                if(result[0].keywords != null){
                    array = (result[0].keywords).split(",");
                    arr.key = (arr.key).concat(array);
                }
                arr.key = unique(arr.key);
                mysql.query('update url_details set keywords = "'+ arr.key +'" where url = "'+arr.url+'" and user_id ="'+user.id+'";',function(err,result){
                    if(err){ 
                        console.log("Error in SQL"+err);
                        mysql.end();
                        res.writeHead(500,{"Content-Type":"text/plain"});
                        res.write("Error in SQL");
                        res.end();
                    }
                    else {
                        res.writeHead(200,{"Content-Type":"text/plain"});
                        res.write("success");
                        res.end();
                    }
                });
            } 
        }
    });    
});
module.exports = app;