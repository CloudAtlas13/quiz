//Definimos el modelo de base de datos. Dando como tipo de dato
//dos parametros, una pregunta y una respuesta correspondiente

module.exports = function(sequelize, DataTypes){
  return sequelize.define('Quiz',
            { pregunta: DataTypes.STRING,
              respuesta: DataTypes.STRING,
            });
}
