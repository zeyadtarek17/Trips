var express = require('express');
var path = require('path');
var app = express();
var alert = require('alert');
var session = require ('express-session');
const PORT = process.env.PORT || 3030;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized:true,
  cookie: {maxAge:600000}
}));







//LOGIN
app.get('/login',function(req,res){
  res.render('login');
});
app.get('/',function(req,res){
  res.render('login');
});
app.post('/',function(req,res){
  if (req.body.username==='admin' && req.body.password==='admin')
  {
    req.session.log=true;
    req.session.loginID= 'admin';
    res.render('home');
  }
  else
  {
  if (req.body.username==="" && req.body.password==="") alert("Fields Cannot be Empty");
  
  else {if (req.body.username==="" && req.body.password!=="") alert("Please enter your username");
  else {if (req.body.password==="" && req.body.username!=="") alert("Please enter your password");
  else {
    var MongoClient= require('mongodb').MongoClient;
  MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
    if(err) throw err;
    var db= client.db('myDB');
    db.collection('myCollection').findOne({username: req.body.username}, (err,checkuser) => {
      //console.log(results);
      if (checkuser===null) 
      {
        alert("Invalid! You are not registered"); 
        res.redirect('/registration');
      }
      else 
      {
        db.collection('myCollection').findOne({username : req.body.username ,password: req.body.password}, (err,checkpassword) => {
        //console.log(results);
        if (checkpassword===null) alert("Incorrect Password!");
        
        else { 
          req.session.log=true ;
          req.session.loginID= req.body.username;
          res.render('home');
        }

        });
      };
    });
  });
}}}}});

app.post('/login',function(req,res){
  if (req.body.username==='admin' && req.body.password==='admin')
  {
    req.session.log=true;
    req.session.loginID= 'admin';
    res.render('home');
  }
  else
  {
  if (req.body.username==="" && req.body.password==="") alert("Fields Can not be Empty");
  
  else {if (req.body.username==="" && req.body.password!=="") alert("Please enter your username");
  else {if (req.body.password==="" && req.body.username!=="") alert("Please enter your password");
  else {
    var MongoClient= require('mongodb').MongoClient;
  MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
    if(err) throw err;
    var db= client.db('myDB');
    db.collection('myCollection').findOne({username: req.body.username}, (err,checkuser) => {
      //console.log(results);
      if (checkuser===null) 
      {
        alert("Invalid! You are not registered"); 
        res.redirect('registration');
      }
      else 
      {
        db.collection('myCollection').findOne({username : req.body.username ,password: req.body.password}, (err,checkpassword) => {
        //console.log(results);
        if (checkpassword===null) alert("Incorrect Password!");
        
        else { 
          req.session.log=true ;
          req.session.loginID= req.body.username;
          res.render('home');
        }

        });
      };
    });
  });
}}}}});



//REGISTRATION
app.get('/registration',function(req,res){
  res.render('registration')
});

app.post('/registration',function(req,res){
  if (req.body.username==="" || req.body.password===""){
  alert("Field Cannot be Empty!");}
  else{
  var MongoClient= require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
  if(err) throw err;
  var db= client.db('myDB');
  db.collection('myCollection').findOne({username :req.body.username}, (err,usertaken) => {
    if (err) throw err;
    if (usertaken===null ) 
    {
      db.collection('myCollection').insertOne({username: req.body.username, password: req.body.password, WantToGo: new Array()});
      alert("The Registeration was Succesfull!");
      res.redirect('/');
    }
    else 
    {
      alert("Username Already Taken!");
      
    };
  });

});
  

//EXPRESS SESSIONS
}});
app.get('/home',function(req,res){
  if(req.session.log)
  res.render('home');
  else
  res.redirect('/login');
}); 
app.get('/hiking',function(req,res){
  if(req.session.log)
  res.render('hiking');
  else
  res.redirect('/login');
});
app.get('/cities',function(req,res){
  if(req.session.log)
  res.render('cities');
  else
  res.redirect('/login');
});
app.get('/islands',function(req,res){
  if(req.session.log)
  res.render('islands');
  else
  res.redirect('/login');
});




//INCA
app.get('/inca', function(req,res){
  if(req.session.log)
  res.render('inca')
  else
  res.redirect('/login');
});
app.post('/incaInsertion',function(req,res){
  var MongoClient= require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
  if(err) throw err;
  var db= client.db('myDB');
  db.collection('myCollection').findOne({username :req.session.loginID}, (err,results) => {
  if(err) throw err;
  if(results.WantToGo.includes("Inca"))
  {
    alert("Inca is Already in your List!");
    res.render('inca');
  }
  else
  {
    db.collection('myCollection').updateOne({username :req.session.loginID }, {$push: {WantToGo:"Inca"}} ,function(err,results) {
      if(err) throw err;
      alert("Inca has been inserted in your List!");
      res.render('inca');
    });
  }  
});
});
});



//ANNAPURNA
app.get('/annapurna', function(req,res){
  if(req.session.log)
  res.render('annapurna');
  else
  res.redirect('/login');
});
app.post('/annapurnaInsertion',function(req,res){
  var MongoClient= require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
  if(err) throw err;
  var db= client.db('myDB');
  db.collection('myCollection').findOne({username :req.session.loginID}, (err,results) => {
  if(err) throw err;
  if(results.WantToGo.includes("Annapurna"))
  {
    alert("Annapurna is Already in your List!");
    res.render('annapurna');
  }
  else
  {
    db.collection('myCollection').updateOne({username :req.session.loginID }, {$push: {WantToGo:"Annapurna"}} ,function(err,results) {
      if(err) throw err;
      alert("Annapurna has been inserted in your List!");
      res.render('annapurna');
    });
  }  
});
});
});



//PARIS
app.get('/paris' ,function(req,res){
  if(req.session.log)
  res.render('paris');
  else
  res.redirect('/login');
});

app.post('/parisInsertion',function(req,res){
  var MongoClient= require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
  if(err) throw err;
  var db= client.db('myDB');
  db.collection('myCollection').findOne({username :req.session.loginID}, (err,results) => {
  if(err) throw err;
  if(results.WantToGo.includes("Paris"))
  {
    alert("Paris is Already in your List!");
    res.render('paris');
  }
  else
  {
    db.collection('myCollection').updateOne({username :req.session.loginID }, {$push: {WantToGo:"Paris"}} ,function(err,results) {
      if(err) throw err;
      alert("Paris has been inserted in your List!");
      res.render('paris');
    });
  }  
});
});
});



//ROME
app.get('/rome' ,function(req,res){
  if(req.session.log)
  res.render('rome');
  else
  res.redirect('/login');
});
app.post('/romeInsertion',function(req,res){
  var MongoClient= require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
  if(err) throw err;
  var db= client.db('myDB');
  db.collection('myCollection').findOne({username :req.session.loginID}, (err,results) => {
  if(err) throw err;
  if(results.WantToGo.includes("Rome"))
  {
    alert("Rome is Already in your List!");
    res.render('rome');
  }
  else
  {
    db.collection('myCollection').updateOne({username :req.session.loginID }, {$push: {WantToGo:"Rome"}} ,function(err,results) {
      if(err) throw err;
      alert("Rome has been inserted in your List!");
      res.render('rome');
    });
  }  
});
});
});



//BALI
app.get('/bali' ,function(req,res){
  if(req.session.log)
  res.render('bali');
  else
  res.redirect('/login');
});
app.post('/baliInsertion',function(req,res){
  var MongoClient= require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
  if(err) throw err;
  var db= client.db('myDB');
  db.collection('myCollection').findOne({username :req.session.loginID}, (err,results) => {
  if(err) throw err;
  if(results.WantToGo.includes("Bali"))
  {
    alert("Bali is Already in your List!");
    res.render('bali');
  }
  else
  {
    db.collection('myCollection').updateOne({username :req.session.loginID }, {$push: {WantToGo:"Bali"}} ,function(err,results) {
      if(err) throw err;
      alert("Bali has been inserted in your List!");
      res.render('bali');
    });
  }  
});
});
});




//Santorini
app.get('/santorini' ,function(req,res){
  if(req.session.log)
  res.render('santorini');
  else
  res.redirect('/login');
});
app.post('/santoriniInsertion',function(req,res){
  var MongoClient= require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
  if(err) throw err;
  var db= client.db('myDB');
  db.collection('myCollection').findOne({username :req.session.loginID}, (err,results) => {
  if(err) throw err;
  if(results.WantToGo.includes("Santorini"))
  {
    alert("Santorini is Already in your List!");
    res.render('santorini');
  }
  else
  {
    db.collection('myCollection').updateOne({username :req.session.loginID }, {$push: {WantToGo:"Santorini"}} ,function(err,results) {
      if(err) throw err;
      alert("Santorini has been inserted in your List!");
      res.render('santorini');
    });
  }  
});
});
});

//SEARCH
app.post('/search',function(req,res){
  var emp = new Array();
  var c = req.body.Search.toLowerCase();
  var destArray=[];
  if("Inca Trail to Machu Picchu".toLowerCase().includes(c)){
    destArray.push("inca");
  }
  if("Annapurna Circuit".toLowerCase().includes(c)){
    destArray.push("annapurna");
  }
  if("Paris".toLowerCase().includes(c)){
    destArray.push("paris");
  }
  if("Rome".toLowerCase().includes(c)){
    destArray.push("rome");
  }
  if("Bali Island".toLowerCase().includes(c)){
    destArray.push("bali");
  }
  if("Santorini Island".toLowerCase().includes(c)){
    destArray.push("santorini");
  }
  if(destArray.length>0){
    res.render('searchresults',{res:destArray});
  }
  else{
    res.render('searchresults',{res:new Array("noDest")});
  }
});

//WANT TO GO VIEW
app.get('/wanttogo' ,function(req,res){
  var MongoClient= require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client){
  if(err) throw err;
  var db= client.db('myDB');
  db.collection('myCollection').findOne({username :req.session.loginID}, (err,results) => {
  if(err) throw err;
  if(req.session.log)
  res.render('wanttogo', {WantToGo: results.WantToGo});

  else
  res.redirect('/login');
});
}); 
});
app.listen(3000);
module.exports = app;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});