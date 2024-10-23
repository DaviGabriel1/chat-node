const User = require("../models/User")

const bcrypt = require("bcryptjs")

module.exports = class AuthController{
    static login(req,res){
        res.render("auth/login")
    }

    static register(req,res){
        res.render("auth/register")
    }
    
    static async registerPost(req,res){
        const {name,email,password, confirmpassword} = req.body;
        
        //validar senha
        if(password != confirmpassword){
            req.flash('message','as senhas não conferem, tente novamente!')
            res.render("auth/register")

            return
        }
        //valida email
        const checkIfUserexist = await User.findOne({where: {email : email}})

        if(checkIfUserexist){
            req.flash('message','o email já está em uso!')
            res.render("auth/register")

            return
        }

        //criar uma senha
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password,salt)

        const user = {
            name,
            email,
            password:hashedPassword
        }
        try{
            const createdUser = await User.create(user)

            //inicializa sessão
            req.session.userid = createdUser.id

            req.flash("message","cadastro realizado com sucesso!")

            req.session.save(() => {
                res.redirect("/")
            })
        }catch(err){
            console.log(err)
        }
    }

    static logout(req,res){
        req.session.destroy();
        res.redirect("/login")
    }
}