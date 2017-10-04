const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { SECRET_KEY } = require('../constans/constans');
const User = require('../db/models/User');

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: SECRET_KEY
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);


    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));




passport.use( new LocalStrategy({
  usernameField : "email"
}, async (email, password, done) => {

  try {


    var user = await User.findOne({email});
    
    if(!user){
      return done(null,false);
    }

    var isMatch = await user.validatePassword(password);


    if(!isMatch){
      return done(null,false);
    }

    done(null,user);

  }catch (error) {
    done(error,false);
  };

}));
