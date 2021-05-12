const express = require("express");
const bodyparser=require("body-parser");
const app=express();

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

const http = require('http');
const port = process.env.PORT || 3000;
/*
const mysql=require("mysql");
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'gazsafety'
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
