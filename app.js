var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var search = require('./routes/search');
var keyword_suggestion = require('./routes/keyword_suggestion');
var solr_add = require('./routes/solr_add');
var google_search = require('./routes/google_search');
var config = require('./config/config.js');
var profile = require('./routes/profile.js');
var gallery = require('./routes/gallery.js');
var dbadd = require('./routes/dbadd.js');
var updatedb = require('./routes/updatedb.js');
var Addkeys = require('./routes/Addkeys.js');
var deletedb = require('./routes/deletedb.js');
var editdb = require('./routes/editdb.js');
var log = require('./routes/log.js');
var logging = require('./routes/activity.js');
var feedback = require('./routes/feedback.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/search', search);
app.use('/googlesearch', google_search);
app.use('/keyword', keyword_suggestion); 
app.use('/solr', solr_add);
app.use('/profile', profile);
app.use('/gallery', gallery);
app.use('/dbadd', dbadd);
app.use('/updatedb', updatedb);
app.use('/Addkeys', Addkeys);
app.use('/deletedb', deletedb);
app.use('/editdb', editdb);
app.use('/log', log);
app.use('/logging', logging);
app.use('/feedback', feedback);


app.listen(config.server_config.port,config.server_config.host);
console.log("success");

module.exports = app;
