const passport = require('passport');
const Strategia = require('passport-local').Strategy;
const usuario = require('../models/usuario');

passport.use('local',new Strategia({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    // Match Email's User
    const user = await usuario.findOne({email});
    if (!user) {
      return done(null, false, { message: 'Not User found.' });
    } else {
      // Match Password's User
      const match = await user.matchPassword(password);
      if(match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect Password.' });
      }
    }
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    usuario.findById(id, (err, user) => {
      done(err, user);
    });
  });

