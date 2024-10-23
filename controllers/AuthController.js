const User = require("../models/User")

const bcrypt = require("bcryptjs")

module.exports = class AuthController{
    static login(req,res){
        res.render("auth/login")
    }

    static async loginPost(req,res){
        const {email, password} = req.body;

        //achar usuário
        const user = await User.findOne({where:{email:email}})

        if(!user) {
            req.flash('message','usuário não encontrado!')
            res.render("auth/login")

            return
        }
        //checar se a senha é compativel
        const passwordMatch = bcrypt.compareSync(password,user.password)

        if(!passwordMatch){
            req.flash('message','senha invalida!')
            res.render("auth/login")

            return
        }

        //inicializa sessão
        req.session.userid = user.id

        req.flash("message","autenticação realizada com sucesso!")

        req.session.save(() => {
            res.redirect("/")
        })
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