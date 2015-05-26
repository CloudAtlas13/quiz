var models = require('../models/models.js');

exports.addFav = function(req, res, next){
  req.user.addQuiz(req.quiz
  ).then(function(){
    //Redirigimos al path anterior al login
    res.redirect(req.session.redir.toString());
  }).catch(function(error) { next(error)});
}

exports.delFav = function(req, res){

  req.user.removeQuiz(req.quiz
  ).then(function(){
    console.log(req.quiz);
    //Redirigimos al path anterior al login
    res.redirect(req.session.redir.toString());
  }).catch(function(error) { next(error)});
}

exports.index = function(req, res, next){
  models.Favourite.findAll({
    where: {
      UserId: Number(req.user.id)
    }
  }).then(function(favs){

    //Recuperamos las id de los quizes marcados como favoritos
    //y los guardamos en el array id
    var favId = [];

    for (var i = 0; i < favs.length; i++) {
      favId[i] = favs[i].QuizId;
    }
    //console.log(favId[0]);
    models.Quiz.findAll({
      where:{id: favId}
    }).then(function(favQuizes){
      res.render('favourites/index', {favQuizes: favQuizes, errors: []});
    }).catch(function(error) { next(error)});
  }).catch(function(error) { next(error)});
}
