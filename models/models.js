var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);

var dialect  = "sqlite";
var host     = (url[5]||null);
var port     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');


// Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd,
        { dialect:  dialect,
          protocol: protocol,
          port:     port,
          host:     host,
          storage:  storage,  // solo SQLite (.env)
          omitNull: true      // solo Postgres
        }
);

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
//Importar definicion de la tabla Comment
var Comment = sequelize.import(path.join(__dirname,'comment'));
//Importar la definicion de la tabla User
var User = sequelize.import(path.join(__dirname,'user'));
//Importar la definición de la tabla Favourite
var Favourite = sequelize.import(path.join(__dirname,'favourite'));

//Hacemos la asignacio 1 a N de los comentarios
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Realizamos la asignacio de cada N a 1 de los Users
Quiz.belongsTo(User);
User.hasMany(Quiz);

//Asignamos N a N Quiz y user a traves de favourite
User.belongsToMany(Quiz, {through: 'Favourite'});
Quiz.belongsToMany(User, {through: 'Favourite'});

exports.Quiz = Quiz;//Exportar la definicion de la tabla Quiz
exports.Comment = Comment;//Exportar la definicion de la tabla Comments
exports.User = User;//Exportar la definicion de la tabla User
exports.Favourite = Favourite;//Exportar la definicion de la tabla Favourite

//sequelize.sync() crea e inicializa tabla de preguntar en DB
sequelize.sync().then(function() {
  //then(..) ejecuta el manejador una vez creada la tabla
  User.count().then(function (count){
    if(count === 0){
      User.bulkCreate(
        [{username: 'admin', password: '1234', isAdmin: true},
         {username: 'pepe', password: '5678'}
        ]
      ).then(function(){
        console.log('Tabla User inicializada');
        Quiz.count().then(function (count){
            if (count === 0) {
              Quiz.bulkCreate(
                [{pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2},
                 {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', UserId: 2}
                ]
              ).then(function(){console.log('Tabla quiz inicializada');
                Favourite.count().then(function(count){
                  if(count === 0){
                      Favourite.bulkCreate(
                        [{ UserId: 2,
                           QuizId: 2}]
                      ).then(function(){
                        console.log('Tabla Favourite inicializada');
                      });
                  }
                })
              })
            };
        });
      });
    };
  });
});
