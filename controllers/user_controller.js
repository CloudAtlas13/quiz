var models = require('../models/models.js');


exports.autenticar = function(login, password, callback){
  models.User.find({
    where: {
      username: login
    }
  }).then(function(user){
      if (user) {
        if (user.verifyPassword(password)) {
            callback(null, user);
        }else {
          callback(new Error('Contraseña incorrecta.'))
        }
      }else {
        callback(new Error('Usuario'+ login + ' no registrado'))
      }
  }).catch(function(error){callback(error)});
};

exports.load = function(req, res, next, userId){
  models.User.find({ where: {id: Number(userId)}
        }).then(function(user) {
      if (user) {
        req.user = user;
        next();
      } else{next(new Error('No existe userId=' + userId))}
    }
  ).catch(function(error){next(error)});
};

exports.edit = function(req, res){
  res.render('user/edit', {user: req.user, errors: []});
}

exports.new = function(req, res){
  var user = models.User.build(
          {username:"", password: ""}
  );
  res.render('user/new',  {user: user, errors: []})
}

exports.create = function(req, res){
  var user = models.User.build( req.body.user );

    user
    .validate()
    .then(
        function(err){
            if (err) {
                res.render('user/new', {user: user, errors: err.errors});
            } else {
                user
                .save({fields: ["username", "password"]})
                .then( function(){
                    req.session.user = {id:user.id, username:user.username};
                    res.redirect('/');
                });
            }
        }
    ).catch(function(error){next(error)});
};

exports.update = function(req, res, next){
  req.user.username  = req.body.user.username;
 req.user.password  = req.body.user.password;

 req.user
 .validate()
 .then(
   function(err){
     if (err) {
       res.render('user/' + req.user.id, {user: req.user, errors: err.errors});
     } else {
       req.user     // save: guarda campo username y password en DB
       .save( {fields: ["username", "password"]})
       .then( function(){ res.redirect('/');});
     }     // Redirección HTTP a /
   }
 ).catch(function(error){next(error)});
};

exports.destroy = function(req, res) {
  req.user.destroy().then( function() {
    // borra la sesión y redirige a /
    delete req.session.user;
    res.redirect('/');
  }).catch(function(error){next(error)});
};
