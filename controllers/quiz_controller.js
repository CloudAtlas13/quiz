var models = require('../models/models.js');

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
  console.log('ENTRO UPDATE');
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
        .save( {fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes');});
      }
    }
  );
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
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index.jade', {quizes: quizes, errors: []});
      console.log('Carga');
    }
    ).catch(function(error) { next(error);});
  }else{
    models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search+"%"]}).then(function(quizes){
      res.render('quizes/index.jade', {quizes: quizes, errors: []});
      console.log('bUSCA');
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
  var quiz = models.Quiz.build( req.body.quiz);

  quiz.validate()
  .then(function(err){
    if(err){
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    } else {
      //Guarda en la base de datos
      quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
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
