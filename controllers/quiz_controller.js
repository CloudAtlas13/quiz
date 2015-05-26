var models = require('../models/models.js');

exports.estadisticas = function(req, res){

  models.Quiz.findAll(
  ).then(function(quizes){
    models.Comment.findAll(
    ).then(function(commentarios){
      var stat = {};
      stat.nQuiz = quizes.length;
      stat.nComments = commentarios.length;
      stat.nMedio = (stat.nComments/stat.nQuiz);
      stat.nComentadas = 0;


      var comentadas = [];
      for (var i = 0; i < commentarios.length; i++) {
        var id = commentarios[i].QuizId;
        var existe = false;
        for (var j = 0; j <= comentadas.length; j++) {
          if (id === comentadas[j]) {
            existe = true;
          }
        }
        if (!existe) {
          stat.nComentadas++;
          comentadas.push(id);
        }
      }
      stat.nNoComentadas = stat.nQuiz - stat.nComentadas;
      res.render('quizes/stats', {stat: stat, errors: [] });
    }).catch(function(error) { next(error)});
  }).catch(function(error) { next(error)});

}


exports.ownershipRequired = function(req, res, next){
  var objQuizOwner = req.quiz.UserId;
  var logUser = req.session.user.id;
  var isAdmin = req.session.user.isAdmin;

  if (isAdmin || objQuizOwner === logUser){
    next();
  }else {
    res.redirect('/');
  }
};

exports.load = function(req, res, next, quizId){
  models.Quiz.find({
            where:{id: Number(quizId)},
            include: [{model: models.Comment}]
  }).then(function(quiz){
      if(quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error) { next(error)});
};

exports.edit = function(req, res) {
  res.render('quizes/edit', {quiz: req.quiz, errors: [] });
}

exports.update = function(req, res) {
  if(req.files.image){
    req.quiz.image = req.files.image.name;
  }
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
    function(err){
      if(err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz
        .save( {fields: ["pregunta", "respuesta", "image"]})
        .then( function(){ res.redirect('/quizes');});
      }
    }
  ).catch(function(error){next(error)});
};

exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz){
    res.render('quizes/show', { quiz: req.quiz, errors: []});
  })
};

exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz){
    console.log(req.quiz.respuesta);
    if(req.query.respuesta === req.quiz.respuesta){
      res.render('quizes/answer', {quiz: req.quiz , "respuesta": "Correcto", errors: []});
    } else {
      res.render('quizes/answer', {quiz: req.quiz , "respuesta": "Incorrecto", errors: []});
    }
  });
};

exports.index = function(req, res){
  if(req.query.search === undefined){
    var options = {};
    if (req.user) {
      options.where = {UserId: req.user.id}
    }
    models.Quiz.findAll(options).then(function(quizes){
      res.render('quizes/index.jade', {quizes: quizes, errors: []});
    }
    ).catch(function(error) { next(error);});
  }else{
    models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search+"%"]}).then(function(quizes){
      res.render('quizes/index.jade', {quizes: quizes, errors: []});
    }).catch(function(error) { next(error);});
  }
};

exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {"pregunta": "Pregunta", "respuesta": "Respuesta"}
    );

    res.render('quizes/new', { quiz: quiz, errors: []});
};

exports.create = function(req, res) {
  req.body.quiz.UserId = req.session.user.id;
  if(req.files.image){
    req.body.quiz.image = req.files.image.name;
  }
  var quiz = models.Quiz.build( req.body.quiz);

  quiz.validate()
  .then(function(err){
    if(err){
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    } else {
      //Guarda en la base de datos
      quiz.save({fields: ["pregunta", "respuesta", "UserId", "image"]}).then(function(){
        res.redirect('/quizes');
      })
    }
  })
};


exports.destroy = function(req, res){
  req.quiz.destroy().then( function(){
    res.redirect('/quizes');
  }).catch(function(error){ next(error)});
};
