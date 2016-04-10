var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads' });
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.post('/register',upload.single('profileimage'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var pasoword = req.body.password;
  var confirmpassword = req.body.confirmpassword;  
   var profileImage;
  if(req.file) {
    profileImage = req.file.fileName;
  } else {
    profileImage = 'noimage.jpg';
  }
  
  //Form validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'User name field is required').notEmpty();
  req.checkBody('password', 'password field is required').notEmpty();
  req.checkBody('confirmpassword', 'Confirm password did not matched').equals(req.body.password);
  
  //Check Error
  var errors = req.validationErrors();
  if(errors) {
    res.render('register', {
        title:'Register', 
        errors: errors
    });   
  } else {
    console.log('No Errors');
  }
  
});

module.exports = router;
