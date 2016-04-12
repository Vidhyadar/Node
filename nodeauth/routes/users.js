var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var User =  require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

router.post('/login',
  passport.authenticate('local', {
      failureRedirect: '/users/login',
      failureFlash: 'Invalid User Name or Password'
    }),
  function(req, res) {
    req.flash('success', 'You are logged in');
    res.redirect('/');
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function (username, password, done) {
    User.getUserByUsername(username, function(err, user){
        if(err) {
            throw err;
        }
        
        if(!user) {
            return done(null, false, {message:'Unknown User.'})
        }
        
        User.comparePassword(password, user.password, function(err, isMatch) {
            if(err) {
                return done(err);                 
            }
            
            if(isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid Username or password'});
            }
        });
    });
}));

router.post('/register',upload.single('profileimage'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
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
  	var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImage
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'You are now registered and can login');
    res.location('/');
    res.redirect('/');
  }
  
});

module.exports = router;
