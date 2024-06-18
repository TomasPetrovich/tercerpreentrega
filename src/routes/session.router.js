const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Credenciales invalidas");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    };

    req.session.login = true;

    res.redirect("/profile");
})


router.get("/faillogin", async (req, res) => {
    res.send("Fallo todo, vamos a morir");
})

//VERSION PARA GITHUB: 

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    //La estrategia de Github nos retornará el usuario, entonces los agrego a mi objeto de Session: 
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/profile");
})

//Logout: 

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router; 