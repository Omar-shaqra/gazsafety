const express = require("express");
const bodyparser=require("body-parser");
const app=express();

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

const http = require('http');
const port = process.env.PORT || 3000;

app.listen(port,function(){
console.log(`Server running at port `+port);

});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://shaqra:<password>@cluster0.osy09.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("test");
  // perform actions on the collection object
  console.log(err);
  client.close();
});

app.get("/",function(req,res){
  res.render("Home");

});
