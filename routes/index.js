var express = require('express');
var router = express.Router();

//Importamos el controlador del 'quiz'
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' , errors: []});
});

router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Autor', errors: [] });
});

router.param('quizId', quizController.load);

//Eventos que atienden a las preguntas y a las respuestas del Quiz
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);

module.exports = router;
