const LocalStretgy = require('passport-local').Strategy;
const JwtStretgy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const passport = require('passport');


passport.use(new LocalStretgy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false ,{ message: 'Invalid Email or password' }); //, 
            }
            if(user.password != password){
                return done(null, false, { message: 'Invalid Email or password' });
            }
            return done(null, user, { message: 'Signin Successfully' }); // 
        } catch (error) {
          return done(error);
        }
    }
));

passport.use(new JwtStretgy(
    {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload , done) => {
        try{
            const user = await User.findById(payload.sub);
            if(!user){
                return done(null, false);
            }
            return done(null ,user);
        }catch(error){
            return done(error );
        }
    }
));

passport.serializeUser((user ,done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
    const user = await User.findById(id);
    if(!user){
        return done(null, false);
    }
    return done(null,user);
});

passport.checkAuthentication = async (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/login');
    }
}

passport.setAuthenticatedUser = async (req, res, next) => {
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;
