var users = { admin:{id:1, username:"admin", password:"1234", time:""},
              pepe: {id:2, username:"pepe", password:"5678", time:""}
            };

exports.autenticar = function(login, password, callback){
  if (users[login]) {
    if (password === users[login].password) {
      callback(null, users[login]);
    } else {
      callback(new Error('Contraseña incorrecta.'));
    }
  }else{
    callback(new Error('No existe el usuario.'));
  }
};
