//generates the mail to the admin about the feedback submitted

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var config = require('../config/config.js');
var nodemailer = require('nodemailer');

app.put('/', function (req, res) { 
    // create reusable transporter object using SMTP transport
        var transporter = nodemailer.createTransport({
        service: 'Gmail',
        tls: {
            rejectUnauthorized : false
        },
        auth: {
            user: 'tathyafeedback@gmail.com',
            pass: 'tathya2015'
        }
    });

    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'tathyafeedback@gmail.com', // sender address
        to: 'sanjiv436.k@gmail.com,nandhini.venkat812@gmail.com', // list of receivers
        subject: 'Tathya|Feedback', // Subject line
        text: 'Hello world ✔', // plaintext body
        html: 'Hi Admin,<br><br>This is '+req.body.name+'<br>'+req.body.msg+'.'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    }); 
    res.writeHead(200,{"Content-Type":"text/plain"});
    res.write("success");
    res.end(); 
});
module.exports = app;