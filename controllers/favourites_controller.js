var models = require('../models/models.js');

exports.añadeFav = function(req, res){
  req.quiz.addUser(req.session.user.id ,{fav: true});
}
