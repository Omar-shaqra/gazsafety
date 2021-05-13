const express = require("express");
const bodyparser=require("body-parser");
const app=express();

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

const http = require('http');
const port = process.env.PORT || 3000;


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uri = "mongodb+srv://shaqra:shaqra1299@cluster0.osy09.mongodb.net/gazsafety?retryWrites=true&w=majority";
const dbname ='gazsafety';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  assert.equal(null, err);
  console.log("connected successfully to mongo");
  const db = client.db(dbname)
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


const insertDocuments = function(db, callback) {
const collection = db.collection('test');
collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(err, result) {
   assert.equal(err, null);
   assert.equal(3, result.result.n);
   assert.equal(3, result.ops.length);
   console.log('Inserted 3 documents into the collection');
   callback(result);
 });
};


/*
const mysql=require("mysql");
const db = mysql.createConnection({
  host     : 'bxgpomtmr8n6sufxh7sn-mysql.services.clever-cloud.com',
  user     : 'ujhbjrtc2tu7usks',
  password : 'ujhbjrtc2tu7usks',
  database : 'bxgpomtmr8n6sufxh7sn'
});
*/
app.listen(port,function(){
console.log(`Server running at port `+port);

});
/*
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('mysql connected...');

})
*/
app.get("/",function(req,res){
  res.render("Home");

});
