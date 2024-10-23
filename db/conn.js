const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("chat","root","root",{
    host:"localhost",
    dialect:"mysql"
})

try{
    sequelize.authenticate();
    console.log("conectado ao mysql com sucesso")
}catch(err){
    console.log(`erro ao conectar: ${err}`)
}

module.exports = sequelize;