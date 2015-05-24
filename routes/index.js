var express = require('express');
var multer  = require('multer');
var router = express.Router();

//Importamos el controlador del 'quiz'
var quizController = require('../controllers/quiz_controller');
//Importamos controlador de los comentarios
var commentController = require('../controllers/comment_controller');
//Importamos controlador de las sesiones
var sessionController = require('../controllers/session_controller');
//Importamos controlador de las sesiones
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' , errors: []});
});

router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Autor', errors: [] });
});

//Autoload de comandos con Id
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);
router.param('userId', userController.load)

//Eventos que atienden a las acciones de la sesión
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

//Eventos que atiendes a las rutas de los usuarios
router.get('/user',  userController.new);
router.post('/user',  userController.create);
router.get('/user/:userId(\\d+)/edit',  sessionController.loginRequired, userController.ownershipRequired,userController.edit);
router.put('/user/:userId(\\d+)',  sessionController.loginRequired, userController.ownershipRequired,userController.update);
router.delete('/user/:userId(\\d+)',  sessionController.loginRequired, userController.ownershipRequired,userController.destroy);
router.get('/user/:userId(\\d+)/quizes', quizController.index);


//Eventos que atienden a las preguntas y a las respuestas del Quiz
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, multer({ dest: './public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.ownershipRequired,quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.ownershipRequired, multer({ dest: './public/media/'}), quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);

//Eventos que atienden a las preguntas y a las respuestas del Comentario
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                  sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);

module.exports = router;
