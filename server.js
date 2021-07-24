const express = require("express");
const bodyparser=require("body-parser");
const app=express();
const request = require('request');

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

const http = require('http');
const port = process.env.PORT || 3000;




const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://shaqra:shaqra1299@cluster0.osy09.mongodb.net/gazsafety?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true });

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

/*
const fireSchema = new mongoose.Schema({
  clientid:String,
  date : {type: Date, default: Date.now},
})

const Fire = mongoose.model("Fire",fireSchema);
*/

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
  },
  problem : { type: String, required: false }

})


const Maintnance = mongoose.model("Maintnance",MaintnanceSchema);



// تعريف الايميل

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
    pass: 'shaqra1299'
  },
   tls:{
      rejectUnauthorized:false
    }
});


// Start

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
  subject: "contact",
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
  subject: "contact response",
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
      subject: "sign in",
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
  err = ' ' ;
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
    res.redirect(`/dashboard/${name}`);
  }else{
    err = 'error'
    res.redirect("signin");

  }
} catch (e) {
    err = 'error'
    res.redirect("signin");
  }

});


app.get('/embaded/:id/:value/:fire',async(req,res,next)=>{
  const id =req.params.id;
  const values =parseInt(req.params.value);
const fire = parseInt(req.params.fire);

var val = " ";
  const value = await new Value({
  id : id,
  value : values+ " " + fire
});
await value.save();



if(values>= 500){
  val = "true";

}

  if (val == "true"){
   if ( fire >= 200){



          try {
            const worker = await Worker.find({acc:'1'}).sort([['DateOfHiring',-1]])

            console.log(worker[0]._id + "  it work");
            const wid = String(worker[0]._id) ;
          console.log(wid + "before");

          const res = await Worker.findOneAndUpdate({_id : wid},{acc : "0"}).exec();
          console.log(res + res.phone);


          //console.log(res.n + res.nModified);

            const maintain = new Maintnance({
              clientid : id,
              workerid :wid,
              problem : "high temperature (fire) "
              //date automatic
            })
             maintain.save();


             const user = await Client.findById(id).exec()
             const email = user.email;
             console.log(email);


               const output = `
            <h1>   <p style="color:red; text-align: center;">WARNING</p> </h1>
               <h3>The temperature is high and we expect fires, so we have sent one of the specialists and our emergency team to you and we will inform the competent authorities  </h2>
               <h4> the info. about team leader : </h3>

               <ul>
                 <li>Name: ${res.name}</li>

                 <li>phone: ${res.phone}</li>

               </ul>
             `;



             var mailOptions = {
               from: 'omarshaqra26@gmail.com' ,
               to: email ,
               subject: "gas leak ,expect fires",
               html: output
             };

             transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                 console.log(error);
               } else {
                 console.log('Email sent: ' + info.response);
               }
             });



          }catch(e){


                   const user = await Client.findById(id).exec()
                   const email = user.email;
                   console.log(email);


                     const output = `
                  <h1>   <p style="color:red; text-align: center;">WARNING</p> </h1>
                     <h3>We've noticed a gas leak in your home </h2>
                     <h4> but We don't have any worker available right now </h3>


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



    }else{




    try {
      const worker = await Worker.find({acc:'1'}).sort([['DateOfHiring',-1]])

      console.log(worker[0]._id + "  it work");
      const wid = String(worker[0]._id) ;
    console.log(wid + "before");

    const res = await Worker.findOneAndUpdate({_id : wid},{acc : "0"}).exec();
    console.log(res + res.phone);


    //console.log(res.n + res.nModified);

      const maintain = new Maintnance({
        clientid : id,
        workerid :wid,
        problem : "gaz leak"
        //date automatic
      })
       maintain.save();


       const user = await Client.findById(id).exec()
       const email = user.email;
       console.log(email);


         const output = `
      <h1>   <p style="color:red; text-align: center;">WARNING</p> </h1>
         <h3>We've noticed a gas leak in your home  </h2>
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



    }catch(e){


             const user = await Client.findById(id).exec()
             const email = user.email;
             console.log(email);


               const output = `
            <h1>   <p style="color:red; text-align: center;">WARNING</p> </h1>
               <h3>We've noticed a gas leak in your home </h2>
               <h4> but We don't have any worker available right now </h3>


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

 }
}

res.send(id + val);


})
/*
app.route('/embadeds/:id/:val').get((req,res)=>{
  const id =req.params.id;
  const values =parseInt(req.params.val);
//const fire = parseInt(req.params.fire);

var val = " ";
  const value = await new Value({
  id : id,
  value : values+ " "
});
await value.save();


})
*/
app.get('/dashboard/:id',async (req,res)=>{
  const id =req.params.id;
console.log(id + ' is here');

let statue = 0;

const user = await Client.findOne({_id : id}).exec();

  const val = await Value.findOne({id : id},{value : true}).exec();
console.log(val);

  if (val)  {
     statue = 1;
  }
console.log(statue);

const maintnance = await Maintnance.find({clientid : id}).exec();

//console.log(worker[0].name);


res.render("dashboard",{maintnance:maintnance , statue:statue , user:user })
})

app.get('/worker/:id',async (req,res)=>{
console.log(" worker data for "+ req.params.id);
const id = req.params.id;
const worker = await Worker.findById(id).exec();
console.log(worker);

res.render("worker",{worker:worker})
})

app.post('/worker/:id',(req,res)=>{

})

app.get('/mobile/:id',async (req,res)=>{

console.log(" mobile id "+ req.params.id);
const id = req.params.id;

const client = await Client.findById(id).exec();
console.log(client.email);
email = client.email;


   const output = `
      <p>thank you for register yuor id is :</p>

        <li>id ${client._id}</li>`;

     var mailOptions2 = {
      from: 'omarshaqra26@gmail.com' ,
      to: email,
      subject: "Register",
      html: output
    };

  await  transporter.sendMail(mailOptions2, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
})

res.render("mobile")
})

app.get("/feedback/:id",(req,res)=>{
  res.render("feedback");
})


app.post("/feedback/:id",async (req,res)=>{
  const id = req.params.id;

var rate = req.body.rate;
  var note = req.body.note;





const maintnance  = await Maintnance.findOneAndUpdate({_id : id},{feedback : {
  rate : rate,
  notes : note
}}).exec();

await  maintnance.save();


  res.render("feedback");
})

app.get("/service",(req,res)=>{


  res.render("service");
})

app.post("/service",(req,res)=>{
console.log(req.body.name);
var name = req.body.name;
var address = req.body.address;
var email = req.body.email;
var phone = req.body.phone;
var problem = req.body.problem;
var date = req.body.date;


         const output = `

         <h4> need service </h3>

         <ul>
           <li>Name: ${name}</li>

           <li>phone: ${phone}</li>
            <li>address: ${address}</li>
             <li>email: ${email}</li>
              <li>problem: ${problem}</li>
               <li>phone: ${date}</li>

         </ul>
       `;



       var mailOptions = {
         from: 'omarshaqra26@gmail.com' ,
         to: 'omarshaqra26@gmail.com' ,
         subject: "service",
         html: output
       };

       transporter.sendMail(mailOptions, function(error, info){
         if (error) {
           console.log(error);
         } else {
           console.log('Email sent: ' + info.response);
         }
       })


       const output2 = `

       <h4> thanks, we receive your order  </h3>


     `;



     var mailOptions2 = {
       from: 'omarshaqra26@gmail.com' ,
       to: email ,
       subject: "service",
       html: output2
     };

     transporter.sendMail(mailOptions2, function(error, info){
       if (error) {
         console.log(error);
       } else {
         console.log('Email sent: ' + info.response);
       }
     })

  res.render("service");
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
