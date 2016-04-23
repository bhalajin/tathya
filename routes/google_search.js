//Generates the google results for the given keyword and returns the results.

var express = require('express');
var URL = require('url');
var querystring = require('querystring');
var app = express();
var google = require('google');


google.resultsPerPage = 30;
var nextCounter = 1;
app.get('/', function(req, res) {
    nextCounter = 1;
    var url = URL.parse(req.url);
    var query = querystring.parse(url.query);
    var s = JSON.parse(query.keyword);
    
    //Obtaining Google pages
    google(s.key.join(" "), function(err, next, links){
      if (err) {
          console.log("ERROR :  " + err);
          res.writeHead(500,{"Content-Type":"text/plain"});
          res.write("Error in Google search");
          res.end();

      } else {
          res.writeHead(200,{"Content-Type":"text/plain"});
          res.write(JSON.stringify(links));
          res.end();
      }
    });
});
module.exports = app;