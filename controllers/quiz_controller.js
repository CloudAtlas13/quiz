var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz) {
      if(quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error) { next(error);
  });
};

exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz){
    res.render('quizes/show', { quiz: req.quiz});
  })
};

exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz){
    console.log(req.quiz.respuesta);
    if(req.query.respuesta === req.quiz.respuesta){
      res.render('quizes/answer', {quiz: req.quiz , "respuesta": "Correcto"});
    } else {
      res.render('quizes/answer', {quiz: req.quiz , "respuesta": "Incorrecto"});
    }
  });
};

exports.index = function(req, res){
  if(req.query.search === undefined){
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index.jade', {quizes: quizes});
      console.log('Carga');
    }
    ).catch(function(error) { next(error);});
  }else{
    models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search+"%"]}).then(function(quizes){
      res.render('quizes/index.jade', {quizes: quizes});
      console.log('bUSCA');
    }).catch(function(error) { next(error);});
  }
};

exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {"pregunta": "Pregunta", "respuesta": "Respuesta"}
    );

    res.render('quizes/new', { quiz: quiz});
};

exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz);

  //Guarda en la base de datos
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');
  })
};
