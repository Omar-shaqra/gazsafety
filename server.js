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


mongoose.connect("mongodb+srv://shaqra:shaqra1299@cluster0.osy09.mongodb.net/gazsafety?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected");
});



const clientSchema = new mongoose.Schema({
  name:String,
  email:String,
  phone:String,
  address:String,
  password:String,
  location:{ type: String, required: false },
  paymentmethod:{ type: String, required: false }
})

const Client = mongoose.model("Client",clientSchema);

const valueSchema = new mongoose.Schema({
  id:String,
  value:String
})

const Value = mongoose.model("Value",valueSchema);

const workerSchema = new mongoose.Schema({
  name:String,
  salary:String,
  DateOfHiring:String,
  phone:String,
  acc:String
})

const Worker = mongoose.model("Worker",workerSchema);


const MaintnanceSchema = new mongoose.Schema({
  clientid:String,
  workerid:String,
  date : {type: Date, default: Date.now},
  feedback : {
    notes : { type: String, required: false },
    rate : { type: String, required: false }
  }

})


const Maintnance = mongoose.model("Maintnance",MaintnanceSchema);



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


app.get("/Register",function(req,res){

  res.render("register");
});

try {
  app.post("/Register",async function(req,res){

    var from = req.body.email;
        const client = new Client({
           name : req.body.name,
           email : req.body.email,
           phone : req.body.phone,
           address : req.body.address,
           password : req.body.password
        });
    await  client.save();

    await console.log(client._id);

   const output = `
      <p>thank you for register yuor id is :</p>

        <li>id ${client._id}</li>`;

     var mailOptions2 = {
      from: 'omarshaqra26@gmail.com' ,
      to: from,
      subject: "test example6",
      html: output
    };

  await  transporter.sendMail(mailOptions2, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }

    res.redirect("/Register");
  });
});
} catch (e) {
  console.log(e);
}

var err="";
app.get("/signin",function(req,res){

  res.render("signin",{err:err});
});

app.post("/signin",async function(req,res){
  var name = req.body.name;
  var pass = req.body.pass;
  console.log(name + pass);
  try {

    const user = await Client.findById(name).exec()
    console.log(user);

  await console.log(user.password);
  if(pass == user.password){
    res.render(`dashboard/:${name}`);
  }else{
    err = 'error'
    res.redirect("signin");
  }
} catch (e) {
    err = 'error'
    res.redirect("signin");
  }

});


app.get('/embaded/:id/:value',async(req,res,next)=>{
  const id =req.params.id;
  const val =req.params.value;

  const value = new Value({
  id : id,
  value : val
});
value.save();

  if (val == "true"){
  const worker = await Worker.find({acc:'1'}).sort([['DateOfHiring']])
  console.log(worker[0]._id + "  it work");
  const wid = String(worker[0]._id) ;
console.log(wid + "before");

const res = await Worker.findOneAndUpdate({_id : wid},{acc : "0"}).exec();
console.log(res + res.phone);


//console.log(res.n + res.nModified);

  const maintain = new Maintnance({
    clientid : id,
    workerid :wid
    //date automatic
  })
   maintain.save();


   const user = await Client.findById(id).exec()
   const email = user.email;
   console.log(email);


     const output = `
  <h1>   <p style="color:red; text-align: center;">WARNING</p> </h1>
     <h3>We've noticed a gas leak in your home and we sent </h2>
     <h4> We have sent a maintenance worker for you </h3>

     <ul>
       <li>Name: ${res.name}</li>

       <li>phone: ${res.phone}</li>

     </ul>
   `;



   var mailOptions = {
     from: 'omarshaqra26@gmail.com' ,
     to: email ,
     subject: "gas leak",
     html: output
   };

   transporter.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
     } else {
       console.log('Email sent: ' + info.response);
     }
   });


}

res.send(id + val);


})


app.get('/dashboard/:id',(req,res)=>{


res.render("dashboard")
})

/*
app.get('/worker',async (req,res)=>{

  const worker = new Worker({
     name :"abdallah saaed",
    salary : "6500",
     DateOfHiring : "3-4-2018",
     phone:"+20137556645",
     acc : 1
  });
await  worker.save();

res.send("worker done!")
})
*/
