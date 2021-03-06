exports.loginRequired = function(req, res, next){
  if (req.session.user) {
    next();
  }else{
    res.redirect('/login');
  }
};

exports.new = function(req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

exports.create = function(req, res){
  var login = req.body.login;
  var password = req.body.password;
  var lastGet = new Date();


  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user){

    if(error){
      req.session.errors = [{"message": 'Se ha producido un error:' +error}];
      res.redirect("/login");
      return;
    }

    //Crear sesion y guardar la ID y el nick
    //La sesión se define por la existencia de  req.session.user
    req.session.user = {id: user.id,
                        username: user.username,
                        isAdmin: user.isAdmin,
                        lastGet: lastGet.getTime()};
    res.redirect(req.session.redir.toString());
  });
};

exports.destroy = function(req, res){
  
  delete req.session.user;
  //Redirigimos al path anterior al login
  res.redirect(req.session.redir.toString());
};
