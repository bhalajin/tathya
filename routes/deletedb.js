//Deletes the keywords from the url_details. If only one user uploaded the URL, entire URL content is removed from SOLR. 

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var _mysql = require('mysql');
var solr = require('solr-client');
var solr_add = require('./solr_add.js');
var config = require('../config/config.js');

// Create a solr client
var client = solr.createClient(config.solr_config);
client.autoCommit = true;

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
    
    //Query to delete from url_details table
    mysql.query('delete from url_details where url = "'+url.url+'"and user_id = "'+url.user+'";',function(err,result){
        if(err){
            console.log("Error in SQL");
        } else {
            
            //Query to get the number of user uploaded particular URL
            mysql.query('select count(*) as c from url_details where url = "'+ url.url +'";', function (err1, result1) {
                if(err1){
                    console.log("Error in sql" + err1);
                } else {
                    if(typeof(result1) != "undefined"){
                        if (result1[0].c === 0 && typeof(url.url) != "undefined"){
                            var q = url.url;
                            var id = "id";
                            
                            //Query to delete it from solr
                            client.delete(id,q,function(err2,obj){
                                if(err){
                                    console.log("solr ;"+err2);
                                }else{
                                    //commit changes to solr
                                    client.commit(function (err3, res1) {
                                        "use strict";
                                        if (err3) {
                                            console.log(err3);
                                        }
                                    });
                                }
                            });
                        }
                    }  
                }
            });
        }
        mysql.end();
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("success");
        res.end();
    });
});
module.exports = app;