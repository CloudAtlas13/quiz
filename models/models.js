var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
//var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = "d7opboh2mpmnen";//(url[6]||null);
var user     = "rzvztygvdlfhyv";//(url[2]||null);
var pwd      = "4gxQ0-ilnVOBcyfIU6Gqvu2-eY";//(url[3]||null);
var protocol = "postgres";//(url[1]||null);

var dialect  = "sqlite";
var host     = "ec2-23-21-76-246.compute-1.amazonaws.com";//(url[5]||null);
var port     = 5432;//(url[4]||null);
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

exports.Quiz = Quiz;//Exportar la definicion de la tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntar en DB
sequelize.sync().then(function() {
  //then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0){
      Quiz.create({
          pregunta: 'Capital de Italia',
          respuesta: 'Roma'
      });
      Quiz.create({
          pregunta: 'Capital de Portugal',
          respuesta: 'Lisboa'
      })
      .then(function(){console.log('Base de datos inicializada')})
    };
  });
});
