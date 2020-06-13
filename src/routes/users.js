const express = require('express');
const router = express.Router();
const usuario = require('../models/usuario');
const passport = require('passport');


router.get('/users/signup', function(request, response){
    response.render('users/signup',{layout: false});
});

router.get('/users/signin', function(request, response){
    response.render('users/signin', {layout: false});
})

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/users/signin'
}))

router.post('/users/signup', async function(request, response, next){
    const { name, email, password, confpassword} = request.body;
    if (name.length < 1 || email.length <1 || password.length <1 || confpassword.length <1 || password != confpassword || password.lenght < 6){
        const errors = [];
        if (name.length < 1 || email.length <1 || password.length <1 || confpassword.length <1){
            errors.push({text: "Asegurese de rellenar todos los campos"})
        }
        if(password != confpassword){
            errors.push({text: "Las contraseñas no coinciden"});
        }
        if(password.lenght < 6){
            errors.push({text: "La contraseña debe contener al menos 6"});
        }
        response.render('users/signup', errors, {layout: false});
    }else{
        const coincidencia = await usuario.findOne({email: email});
        if(coincidencia){
            response.redirect('/users/signup');
        }
        const newUser = new usuario({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save()
        response.redirect('/users/signin');
        next()
        
    }
})

module.exports = router;