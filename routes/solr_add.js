//Adds ID,URL,Title and Keywords into SOLR. If already exists,keywords get appended

var express = require('express');
var cors = require('cors');
var app = express();
var url = require('url');
var quer = require('querystring');
var solr = require('solr-client');
var _mysql = require('mysql');
var unique = require('unique-words');
var config = require('../config/config.js');
var mysql;
var arr;
var user={};   //stores the user details

app.use(cors());

// Create a solr client
var client = solr.createClient(config.solr_config);

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;


//MYSQL Connection
function dbconnection() {
    mysql=_mysql.createConnection(config.dbconfig);
    mysql.connect(function(err){
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
    mysql.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            dbconnection();
        } else {                                      
            console.log("inside mysql.on");                                  
        }
    });  
}



//deleting the record in database
//to maintain atomicity in solr and tathya database
function deleteURL(url) {
    mysql.query('delete from url_table where url="'+url+'";', function(error){
        if(error) {
            console.log("SQL Deletion error");   
        }
    });
}


//Adding user to Database
function AddUser(user) {
    mysql.query('select count(*) as c from user_details where user_id = "'+ user.id +'";', function (err, result) {
        if (err) {
            console.log("error in select user count query");
        } else {
            if (result[0].c === 0) {
                mysql.query('insert into user_details(user_id, user_name, email,google,picture,gender) values("'+ user.id +'", "'+ user.name +'", "'+ user.email +'", "'+ user.link +'", "'+ user.picture +'", "'+ user.gender +'");', function(err, result) {
                    if(err) {
                        console.log("Existing user"+err);
                    } else {
                        console.log("User added");
                    }
                });
            }
        }
    });
}


//Adding to solr
function SolrAdd(res) {
    client.add({ id : arr.url, url : arr.url, keywords : arr.key, title : arr.title }, function (err, obj) {

        "use strict";
        if (err) {
            console.log(err);
            mysql.query('ROLLBACK', function (err1) {
                if (err1) {
                    console.log("error in rolling back");
                    mysql.end();
                } else {
                    console.log("rollback");
                    mysql.end();
                }
            });
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.write("Document Addition Fails");
            res.end(); 
        } else {
            //commit changes to solr
            client.commit(function (err1, res1) {
                "use strict";
                if (err1) {
                    mysql.query('ROLLBACK', function (err2) {
                        if (err2) {
                            console.log("error in rolling back"+err2);
                             mysql.end();
                        } else {
                            console.log("rollback");
                             mysql.end();
                        }
                    });
                    console.log(err2);
                    res.writeHead(500,{"Content-Type":"text/plain"});
                    res.write("Solr Commit Error");
                    res.end();
                }
                if (res) {
                    mysql.query('COMMIT', function (err4) {
                        if(err4) {
                            console.log("error in commit"+err4);
                            mysql.end();
                            res.writeHead(500,{"Content-Type":"text/plain"});
                            res.write("MySql Connection error");
                            res.end();
                        } else {
                            mysql.end();
                            res.writeHead(200,{"Content-Type":"text/plain"});
                            res.write(JSON.stringify(obj));
                            res.end(); 
                        }
                    });
                }
            });
        }
    });
}

//Updating exsisting url
function updatekeywords(res){
    mysql.query('SELECT url FROM url_details WHERE url = "'+arr.url+'"and user_id ="'+user.id+'";', function (err, result) {
        //MYSQL Connection error
        if (err) {
            console.log(err);
            mysql.query('ROLLBACK', function (err1) {
                if (err1) {
                    console.log("error in rolling back"+err1);
                    mysql.end();
                } else {
                    console.log("rollback");
                    mysql.end();
                }
            });
            
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.write("MySql Connection error");
            res.end();
        }

        //Updating Keywords
        else {
            if(typeof(result[0]) != "undefined"){
                var temp = 'id:"'+result[0].url+'"';
                var solr_query = client.createQuery().q(temp);
            }
            //search for keywords             			  
            client.search(solr_query,function(err1, obj1){
                if (err1) {
                    mysql.query('ROLLBACK', function (err1) {
                        if (err1) {
                            console.log("error in rolling back"+err1);
                            mysql.end();
                        } else {
                            console.log("rollback");
                            mysql.end();
                        }
                    });
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.write("Solr searching error");
                    res.end();
                } else {     
                    //Combining new keywords with existing one
                    if(typeof(obj1.response.docs[0]) != "undefined" || obj1.response.docs[0] === ""){
                        var array = obj1.response.docs[0].keywords;
                        if(typeof(array) != "undefined"){
                            for(i = 0; i < array.length; i++){
                                arr.key.push(array[i]);
                            }
                            arr.key = unique(arr.key);
                        }
                        if(arr.title === ""){
                            arr.title = obj1.response.docs[0].title;
                        }
                    }
                    
                    //Adding Documents with updated keywords                  
                    SolrAdd(res);
                }
            });
        }
    });
}

//listening for put request
app.put ('/', function (req, res) { 
    //initiating DB connection
    dbconnection();  
    arr = req.body;
    user = JSON.parse(arr.user_info);
    //Function to add documents to the solr
    AddUser(user);
    
    //inserting doc into DB
    mysql.query ('insert into url_details(url,user_id) values("'+arr.url+'", "'+ user.id +'");',function (error) {
        //handling insertion error || already existing URL
        if(error) {
            //1062 is error code for duplicate entry
            if (error.errno === 1062) {
                updatekeywords(res);
            } else {
                mysql.query('ROLLBACK', function (err1) {
                    if (err1) {
                        console.log("error in rolling back");
                    } else {
                        console.log("rollback");
                    }
                });
                mysql.end();
                res.writeHead(500,{"Content-Type":"text/plain"});
                res.write("MySql Connection error");
                res.end();
            }
        }
        // New URL
        else {
            //to check whether a resource is already added in solr
            mysql.query('select count(url) as c from url_details where url = "'+ arr.url +'";', function (err, result) {
                if(result[0].c === 1) { //if there is only one entry in DB then it is newly added to solr
                    SolrAdd(res);
                } else {    //already exsisting resource
                    updatekeywords(res);
                }
            });  
        }
        
    });        
});

module.exports = app;
