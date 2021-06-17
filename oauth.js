const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('./user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app=express();
const url = 'mongodb+srv://<username>:<password>@cluster0.4yhpu.mongodb.net/MyFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>{
console.log('connected to DB');
})
.catch((err)=>{
  console.log(err);
});

passport.use(new GoogleStrategy({
    clientID: CLIENTID,
    clientSecret: CLIENTSECRET,
    callbackURL: "/auth/google/callback"
  },(accessToken, refreshToken, profile, done)=> {
    User.findOne({googleId: profile.id})
    .then((currentuser)=>{
      if(currentuser){
        console.log('presnt');
        done(null, currentuser);
      }
      else{
        const user = new User({
          googleId: profile.id
        });
        user.save()
        .then((result)=>{
          console.log('db created');
          done(null, result);
        })
      }
      
    });
  }
));
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  app.get('/',(req,res)=>{
      res.send('sucess');
  });
app.listen(5400);