var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET Categories listing. */
router.get('/add', function(req, res, next) {
    res.render('addcategory', {
      "title": "Add Category"     
    });
});

router.post('/add', function (req, res, next) {
    var name =  req.body.name;
    req.checkBody('name','Name filed is required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors) {
        res.render('addpost', {
        "errors": errors
        });
    } else {
        var categories =  db.get('categories');
        
        categories.insert({"name": name}, function (error, categories) {
            req.flash('success','Category Added');
            res.location('/');
            res.redirect('/');
        });        
    }
});

module.exports = router;