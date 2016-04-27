var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/uploads-images' });
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET posts listing. */

router.get('/show/:id', function(req, res, next) {
  var posts = db.get('posts');
  
  posts.findById(req.params.id, function (err, post) {
    res.render('showpost', {
      "title": req.params.id,
      "post": post     
    });
  });
});


router.get('/category/:category', function(req, res, next) {
  var posts = db.get('posts');
  
  posts.find({category: req.params.category}, {}, function (err, posts) {
    res.render('index', {
      "title": req.params.category,
      "posts":posts     
    });
  });
});



router.get('/add', function(req, res, next) {
  var categories = db.get('categories');
  
  categories.find({}, {}, function (err, categories) {
    res.render('addpost', {
      "title": "Add post",
      "categories":categories     
    });
  });
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  var title =  req.body.title;
  var category =  req.body.category;
  var body =  req.body.body;
  var author =  req.body.author;
  var date =  new Date();
  var mainimage = 'No Image File';
  if(req.file) {
    mainimage = req.file.filename;
  }
  
  req.checkBody('title','Title filed is required').notEmpty();
  req.checkBody('body','Body filed is required').notEmpty();
  
  var errors = req.validationErrors();
  
  if(errors) {
    res.render('addpost', {
      "errors": errors
    });
  } else {
    var posts =  db.get('posts');
		posts.insert({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainimage
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				req.flash('success','Post Added');
				res.location('/');
				res.redirect('/');
			}
		});
  }
  
  console.log(title);
});

router.post('/addcomments',  function(req, res, next) {
  var postid =  req.body.postid;
  var name =  req.body.name;
  var email =  req.body.email;
  var body =  req.body.body;
  var commentDate =  new Date();
  
  req.checkBody('name','Name filed is required').notEmpty();
  req.checkBody('email','Email filed is required but never displayed').notEmpty();
  req.checkBody('email','Email filed is not formated properly').isEmail();
  req.checkBody('body','Body filed is required').notEmpty();
  
  var errors = req.validationErrors();
  
  if(errors) {
    var posts =  db.get('posts');
    posts.findById(postid, function (errors, post) {
      res.render('addpost', {
        "errors": errors,
        "post": post
      });      
    });

  } else {
    var posts =  db.get('posts');
    var comment = {
      'name': name,
      'email': email,
      'body': body,
      'commentDate': commentDate
    };
    
    posts.update({
      "_id": postid
    }, {
      $push: {
        "comments": comment
      }
    }, function(err, post){
      if(err){
        throw err;
      } else {
				req.flash('success','Comments Added');
				res.location('/show/' + postid);
				res.redirect('/show/' + postid);
      }
    });
  }
});

module.exports = router;
