var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/mutant-league');
var mutantCollection = db.get('mutants');

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signin', function(req, res, next) {
  res.render('sign_in')
})

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
})

router.post('/', function(req,res, next) {
  mutantCollection.insert({name:req.body.sign_in, password:req.body.password})
  res.redirect('/users/dashboard');
})

module.exports = router;