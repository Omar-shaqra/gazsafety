const express = require("express");
const bodyparser=require("body-parser");
const app=express();

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

const http = require('http');
const port = process.env.PORT || 3000;




const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://shaqra:shaqra1299@cluster0.osy09.mongodb.net/user?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected");
});


  // perform actions on the collection object

/*  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(err, result) {

    console.log('Inserted 3 documents into the collection');

  });
*/

  console.log(err);
  insertDocuments(db,function(){
      client.close();
  });

});




var nodemailer = require('nodemailer');
//let transporter = nodemailer.createTransport(options[, defaults])
var transporter = nodemailer.createTransport({
  host: 'https://gazsafety.herokuapp.com',
   port: 587,
   secure: false, // true for 465, false for other ports
  service: 'gmail',
  auth: {
//     type: 'OAuth2',
    user: 'omarshaqra26@gmail.com',
    pass: 'shaqra123456'
  },
   tls:{
      rejectUnauthorized:false
    }
});



app.listen(port,function(){
console.log(`Server running at port `+port);

});

app.get("/",function(req,res){
  res.render("Home");

});


app.post("/",function(req,res){

var  from = req.body.email;
var  name = req.body.name;
var    message = req.body.message;

const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>

    <li>Email: ${req.body.email}</li>

  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>`;



var mailOptions = {
  from: '' ,
  to: 'omarshaqra26@gmail.com',
  subject: "test example",
  html: output
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

var mailOptions2 = {
  from: 'omarshaqra26@gmail.com' ,
  to: from,
  subject: "test example6",
  text: 'thank you for contact us'
};

transporter.sendMail(mailOptions2, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  res.redirect("/");

});
