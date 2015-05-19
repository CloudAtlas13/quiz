var express = require('express');
var router = express.Router();

//Importamos el controlador del 'quiz'
var quizController = require('../controllers/quiz_controller');
//Importamos controlador de los comentarios
var commentController = require('../controllers/comment_controller');
//Importamos controlador de las sesiones
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' , errors: []});
});

router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Autor', errors: [] });
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

//Eventos que atienden a las acciones de la sesión
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

//Eventos que atienden a las preguntas y a las respuestas del Quiz
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);

router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

//Eventos que atienden a las preguntas y a las respuestas del Comentario
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                  sessionController.loginRequired, commentController.publish);

module.exports = router;
