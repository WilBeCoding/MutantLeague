var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/mutant-league');
var mutantCollection = db.get('mutants');
var cookie = require('cookie');
var bcrypt = require('bcrypt');

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('sign_up')
})

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
})

router.post('/signin', function(req,res, next) {
  bcrypt.hash(req.body.user_password, 8, function(err, hash) {
    mutantCollection.find({email: req.body.user_email}, function (err, mutant) {
      if(mutant) {
        if(bcrypt.compareSync(req.body.user_password, mutant[0].user_password)) {
          req.session.email = req.body.user_email;
          res.redirect('/users/dashboard')
        }
      }
    res.render('/', {errors: ["Your Password Is Incorrect"], title: "Mutant League"})
    })
  })
})

router.post('/signup', function(req,res,next) {
  req.session.email = req.body.user_email
  var email = req.session.email
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.user_password, salt, function(err, hash) {
      mutantCollection.find({email: req.body.user_email}, function(err, user) {
        if(req.body.user_email.length > 0) {
          res.render('/', {errors: ["Email Already Taken"], title: "Sign Up"})
        }
      })
      if(req.body.user_email.length === 0) {
        res.render('/', {errors: ["Email can't be blank"], title: "Sign Up", email: req.body.user_email, password: req.body.user_password})
      }
      else if(req.body.user_password !== req.body.user_password_confirmation) {
        res.render('fail', {errors: ["user_password doesn't match confirmation user_password"], email: req.body.user_email, password: req.body.user_password, title: "Sign Up"})
      }
      else if(req.body.user_password.length > 0 && req.body.user_password.length <8) {
        res.render('/', {errors: ["Your user_password Must Be At Least 8 Characters Long"], email: req.body.user_email, user_password:req.body.user_password, title: "Sign Up"})
      }
      else if(req.body.user_password.length === 0 || req.body.user_password_confirmation.length === 0) {
        res.render('/', {errors: ["Both user_password Fields Must Be Completed"], email: req.body.user_email, password: req.body.user_password,title: "Sign Up"})
      } else{
        mutantCollection.insert({email: req.body.user_email, password: hash})
        res.redirect('/')
      }
   })
  })
})

module.exports = router;