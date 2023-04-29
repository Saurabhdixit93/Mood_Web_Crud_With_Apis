const express = require('express');
const passport = require('passport');
const router = express.Router();


// for Api Using

router.use('/api',require('./apiUserRoutes'));
router.use('/api',require('./apiMoodRoutes'));

// dashboard page routes
router.get('/',(req,res) =>{
     return res.render('dashboard',{
        errors: [],
        req:req,
        user: req.user,
        message: req.flash()
    });
});

// login page
router.get('/login'  ,(req,res) => {
    if(req.isAuthenticated()){
        return res.redirect('/?msg=Please+logout+first+to+login');
    }
    return res.render('login',{
        errors: [],
        req,
        message: req.flash()
    });
});


// register page routes
router.get('/register', (req,res) => {
    if(req.isAuthenticated()){
        if(req.isAuthenticated()){
            return res.redirect('/?msg=Please+Logout+To+create+new+Account');
        }
    }
    return res.render('register',{
        errors: [],
        req
    });
});

// logout function 
router.get('/logout',passport.checkAuthentication ,(req,res) => {
    try{
        req.session.destroy(() => {
            req.logout(() =>{
                return res.redirect('/?msg=Logout+Successfully')
            });
        });
    }catch(error){
        return res.redirect(`/?msg=${error}`);
    }
});

// mood page routes

router.use('/user' , require('./auth'));
router.use('/mood' ,require('./mood'));


module.exports = router;