//Gets the url as a input and returns the keywords (extracting from the title) 

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var request = require('request');
var cheerio = require('cheerio');
var keyword_extractor = require("keyword-extractor");
var unique = require('unique-words');

var obj = {};
var arr = [];

app.put('/', function(req, res) {
    var body = req.body;
    request(body.id, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var temp=" ";

            //Getting title of the web page
            var get_title = cheerio.load(html);
            var title = get_title('title').text();
            
            //Extracting words from title           
            if(typeof(title) != "undefined"){
                obj.title = title;
                var extraction_result = keyword_extractor.extract(title,{
                    language:"english",
                    remove_digits: true,
                    return_changed_case:true
                });
                temp += extraction_result;
            }else{
                obj.title = body.id;
            }
            
            //Removing Redundancy  
            arr = temp.split(",");     
            arr = unique(arr);
            
            //Removing Empty keywords and makes every keyword into uppercase 
            for(i=0;i<arr.length;i++){
                arr[i]=arr[i].toUpperCase();
                if(arr[i].length === 0 || arr[i].length === 1)
                {
                    arr.splice(i,1);
                    i--;
                }
            }
            obj.key = arr;
            res.writeHead(200,{"Content-Type":"text/plain"});
            res.write(JSON.stringify(obj));
            res.end();     
        }
        else{
            console.log("error on fetching");
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.write("No Internet connection");
            res.end();
        }
    });
    
});

module.exports = app;
