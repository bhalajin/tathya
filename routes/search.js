//Gets the keyword and returns the results from SOLR search function

var express = require('express');
var app = express();
var solr = require('solr-client');
var http = require('http');
var URL = require('url');
var querystring = require('querystring');
var config = require('../config/config.js');
var obj;
var query1;
var tathya = 0, google = 0;

//creating solr client
var client = solr.createClient(config.solr_config);

//Handling favicon
app.get('/favicon', function(req, res) {
    
});

app.get('/', function(req, res) {
    obj = {};
    obj1 = {};
    tathya = 0;
    google = 0;
    var url1 = URL.parse(req.url);
    query1 = querystring.parse(url1.query);
    var arr = (query1.keyword).split(/,| +/);
    obj1.key = arr;
    
    var temp = "keywords:(*" + arr[0];
    for(i = 1; i < arr.length; i += 1) {
        temp += '*+OR+*' + arr[i];
    }
    temp += '*)';
    
    //contructing query for search in solr
    var query = "q=" + temp + "&fl=id%2Ctitle%2Cdescription&wt=json";

    //search for keywords             			  
    client.search(query,function(err, res1){
        if (err) {
            console.log(err);
            obj.tathya = [];
            obj.Tathya_error = "Server error";
        } else {
            if ( res1.response.docs.length === 0) {
                 obj.Tathya_error = "No Content";
            }
            obj.tathya = res1.response.docs;
            obj.Tathya_error = "Nope";
        }  
        tathya = 1;
        console.log(query1.keyword + "   " + typeof(query1.keyword));
            googleSearch(obj1, res);
       
    });
});

function googleSearch(obj1, res) {
    var options = {
        hostname: config.server_config.host,
        port: config.server_config.port,
        method: 'GET'
    };
    options.path = "/googlesearch?keyword=" + JSON.stringify(obj1);
    var req1 = http.get(options, function(res2) {
        if (res2.statusCode === 500) {
            console.log("Error Status : " + res2.statusCode);
            obj.google = [];
            obj.google_error = "Google error";
            google = 1;
            if (tathya === 1 && google === 1) {
                setTimeout(function () {
                    res.writeHead(200,{"Content-Type":"text/plain"});
                    res.write(JSON.stringify(obj));
                    res.end(); 
                }, 100);
            }
        } else {
            res2.on('data', function (chunk) {
                var temp = JSON.parse(chunk);
                if (temp.length === 0) {
                    obj.google_error = "No Content";
                }
                for (i = 0; i < temp.length; i += 1) {
                    if (temp[i].link === "" || temp[i].link === undefined || temp[i].link === null) {
                        temp.splice(i, 1);
                    }
                }
                obj.google = temp;
                obj.google_error = "Nope";
                google = 1;
                if (tathya === 1 && google === 1) {
                    setTimeout(function () {
                        res.writeHead(200,{"Content-Type":"text/plain"});
                        res.write(JSON.stringify(obj));
                        res.end(); 
                    }, 100);
                }
            });
        }   
        
    }).on('error', function(e) {
        console.log("Got error: " + e);
        obj.google = [];
        obj.google_error = "Google error";
        google = 1;
        if (tathya === 1 && google === 1) {
            console.log(obj);
            setTimeout( function() {
                res.writeHead(200,{"Content-Type":"text/plain"});
                res.write(JSON.stringify(obj));
                res.end(); 
            }, 3000);
        }
    });
   
}

module.exports = app;