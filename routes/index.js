var express = require('express');
var router = express.Router();

//Importamos el controlador del 'quiz'
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

router.get('/authors', function(req, res, next) {
  res.render('authors', { title: 'Bienvenido a Quiz' });
});

//Eventos que atienden a las preguntas y a las respuestas del Quiz
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
