//Definimos el modelo de base de datos. Dando como tipo de dato
//dos parametros, una pregunta y una respuesta correspondiente

module.exports = function(sequelize, DataTypes){
  return sequelize.define('Quiz',
            { pregunta:{ type: DataTypes.STRING,
                         validate:{ notEmpty:{msg: "->Falta Pregunta"}}
              },
              respuesta:{type: DataTypes.STRING,
                         validate:{ notEmpty:{msg: "->Falta Respuesta"}}
<<<<<<< HEAD
<<<<<<< HEAD
              },
              image: {
                 type: DataTypes.STRING
=======
>>>>>>> master
=======
              },
              image: {
                type: DataTypes.STRING
>>>>>>> parent of b7fc31e... Revert "Quiz 23 mal"
              }
            }
  );
};
