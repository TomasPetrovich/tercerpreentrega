const passport = require("passport");
const local = require("passport-local");

//Estrategia con GitHub:
const GitHubStrategy = require("passport-github2");

//Traemos el UsuarioModel y las funciones de bcryp: 
const UserModel = require("../models/user.model.js");
const CartManager = require("../controllers/cart-manager.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const config = require("./config.js");

const LocalStrategy = local.Strategy;


const initializePassport = () => {
    //Vamos a armar nuestras estrategias: Registro y Login. 

    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
    
        try {
            let usuario = await UserModel.findOne({ email });
    
            if (usuario) {
                return done(null, false);
            }
    
            const newCart = await CartManager.crearCarrito();
    
            let nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart._id
            };
    
            let resultado = await UserModel.create(nuevoUsuario);
            return done(null, resultado);
        } catch (error) {
            return done(error);
        }
    }));

    //Agregamos otra estrategia para el "Login".
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {

        try {
            //Primero verifico si existe un usuario con ese email: 
            let usuario = await UserModel.findOne({ email });

            if (!usuario) {
                console.log("Este usuario no existeee ehhhh vamo a mori!");
                return done(null, false);
            }

            //Si existe verifico la contraseña: 
            if (!isValidPassword(password, usuario)) {
                return done(null, false);
            }

            return done(null, usuario);


        } catch (error) {
            return done(error);
        }
    }))

    //Serializar y deserializar: 

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    })

    //Acá generamos la nueva estrategia con GitHub: 

    passport.use("github", new GitHubStrategy({
        clientID: config.githubClientID,
        clientSecret: config.githubClientSecret,
        callbackURL: config.githubCallbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        //Veo los datos del perfil
        console.log("Profile:", profile);

        try {
            let usuario = await UserModel.findOne({ email: profile._json.email });

            if (!usuario) {

                const newCart = await CartManager.crearCarrito();

                let nuevoUsuario = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 21,
                    email: profile._json.email,
                    password: "coder",
                    cart: newCart._id
                }

                let resultado = await UserModel.create(nuevoUsuario);
                done(null, resultado);
            } else {
                done(null, usuario);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = initializePassport;