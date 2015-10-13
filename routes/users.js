var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/mutant-league');
var mutantCollection = db.get('mutants');

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('sign_up', {})
})

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', {});
})

router.post('/signin', function(req, res, next) {
  var errors = [];
  if (!req.body.user_email.trim()){
    errors.push("Email is required.");
  }
  if (!req.body.user_email.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")){
    errors.push("Email is not valid email.");
  }
  if (!req.body.user_password.trim()){
    errors.push("Password is required.");
  }
  if (req.body.user_password.length <= 3){
    errors.push("Password must be greater than 3 characters.");
  }
  mutantCollection.findOne({user_email: req.body.user_email}, function(err, mutant){
    if (!mutant){
      errors.push("This email doesn't exist. Try signing up?");
    } else if (!bcrypt.compareSync(req.body.password, mutant.password)) {
      errors.push("Invalid password.");
    }
    if (errors.length==0){
      req.session.user = mutant.user_email;
      res.redirect('/');
    }
    res.render('users/dashboard', {errors: errors});
  });
});

router.post('/signup', function(req, res, next) {
  var errors = [];
  if (!req.body.user_email.trim()){
    errors.push("Email is required.");
  }
  if (!req.body.user_email.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")){
    errors.push("Email is not valid email.");
  }
  if (!req.body.user_password.trim()){
    errors.push("Password is required.");
  }
  if (req.body.user_password.length <= 3){
    errors.push("Password must be greater than 3 characters.");
  }
  if(req.body.user_password !== req.body.user_password_confirmation){
    errors.push("Passwords do not match")
  }
  mutantCollection.findOne({email: req.body.user_email}, function(err, mutant){
    if (err) {
      console.log('db err on find', err);
    }
    if (mutant){
      errors.push("This email is already signed up. Try logging in?");
    }
    if (errors.length==0){
      var password = bcrypt.hashSync(req.body.user_password, 11);
      var email = req.body.user_email.toLowerCase();
      mutantCollection.insert({email:email, password:password}, function(err, mutant){
        if (err) {
          console.log('db err on insert', err);
        }
      });
      req.session.user = email;
      res.redirect('/');
    }
    res.render('sign_up', {errors:errors});
  })
});

module.exports = router;