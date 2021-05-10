const express = require("express");
const bodyparser=require("body-parser");
const app=express();

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

/*const mysql=require("mysql");
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hotelscontrolsystem'
});
*/
app.listen(3308,function(){
console.log("stat server on 3308");

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
  res.render("Home.html");

});
