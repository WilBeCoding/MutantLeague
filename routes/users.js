var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/mutant-league');
var mutantCollection = db.get('mutants');

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
  bcrypt.hash(req.body.password, 8, function(err, hash) {
    mutantCollection.find({email: req.body.user_name}, function (err, mutant) {
      if(mutant) {
        if(bcrypt.compareSync(req.body.user_name, mutant[0].password)) {
          req.session.username = req.body.user_name;
          res.redirect('/users/dashboard')
        }
      }
    res.render('/', {errors: ["Your Password Is Incorrect"], title: "Mutant League"})
    })
  })
})

router.post('/signup', function(req,res,next) {
  req.session.username = req.body.user_name
  var userName = req.session.username
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.user_name, salt, function(err, hash) {
      if(req.body.user_name.length > 0) {
        res.render('/', {errors: ["Username Already Taken"], title: "Sign Up"})
      }
    })
    if(req.body.user_name.length === 0) {
      res.render('/', {errors: ["Username can't be blank"], title: "Sign Up", username: req.body.user_name, password: req.body.password})
    }
    else if(req.body.password.length > 0 && req.body.password.length <8) {
      res.render('/', {errors: "Your Password Must Be At Least 8 Characters Long"], username: req.body.user_name, password:req.body.password, title: "Sign Up"})
    } else{
      mutantCollection.insert({username: req.body.user_name, password: hash, title: "Sign Up"})
      res.redirect('/')
    }
  })
})

module.exports = router;