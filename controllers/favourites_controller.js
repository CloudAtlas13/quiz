var models = require('../models/models.js');

exports.addFav = function(req, res){
  req.quiz.addUser(req.session.user.id ,{fav: true});
}

exports.delFav = function(req, res){
  res.render('./index.jade', { errors: []});
}

exports.index = function(req, res){
  res.render('./index.jade', { errors: []});
}
