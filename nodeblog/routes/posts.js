var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET posts listing. */
router.get('/add', function(req, res, next) {
  res.render('addpost', {
    title: 'Add post'
  });
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  var title =  req.body.title;
  var category =  req.body.category;
  var body =  req.body.body;
  var author =  req.body.author;
  var date =  new Date();
  console.log(title);
});

module.exports = router;
