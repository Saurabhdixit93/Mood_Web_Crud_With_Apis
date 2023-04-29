const express = require('express');
const { check , validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();
const nodemailer = require('nodemailer');
const errorr = 'Check+All+Field+Correctly+Filled+password+with+6+or+more+characters';
const ejs = require('ejs');
const fs = require('fs');
const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');

// router for user registration
router.post('/register-user',
 [
    check('name', 'Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password' ,'Please Enter a password with 6 or more characters').isLength({min:6}),
 ],
 async (req ,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       
       return res.redirect(`/register?msg=${errorr}`);
    }

    // destructure user input 
    const { name ,email ,password } = req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.redirect(`/register?msg=User+Is+Alreay+With+this+email${user.email}`);
        }
        user = await new User({
            name,
            email,
            password,
        });
        await user.save();
        return res.redirect('/login?msg=Account+Succesfully+Created+,Please+Login+to')
    }catch(error){
        return res.redirect(`/register?msg=${error}`);
    }

});

// login post method

router.post('/login',
[
    check('email','Please include a valid email').isEmail(),
    check('password' ,'Password is Required').exists(),
],
passport.authenticate('local',{
    failureRedirect: '/login',
    failureFlash: true,
},)
,
   async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.redirect(`/login?msg=${errorr}`);
    }
    return res.redirect('/?msg=Login+Successfully');
});


// email template load from viewfiles for password reset
const passwordResetTemplate = fs.readFileSync('./views/passwordreset/passwordResetMail.ejs','utf-8');

// Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, 
    auth: {
      user:process.env.SMTP_USER_EMAIL,
      pass:process.env.SMTP_USER_PASSWORD
    },
    secure: process.env.SECURE_SMTP,
});

// password reset form showing

router.get('/reset-password-form',(req ,res) => {
    return res.render('forgotPassword',{
        message: {typs:null ,text:null}
    });  
});

// send password reset link 
router.post('/passoword-reset/',async (req ,res ) => {
    try{
        const { email } = req.body;
        // Find the user associated with the email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.render('forgotPassword', { 
                message: { type: 'danger', text: 'No user found with that email address.' }
            });
        }
        // Set the token expiration time in minutes
        const tokenExpirationInMinutes = 30;
        // Generate a random token using the crypto module
        const generateToken = () => {
          const token = crypto.randomBytes(64).toString('hex'); 
          const secret = process.env.JWT_SECRET;
          const hash = crypto.createHmac('sha256' , secret).update(token).digest('hex');
          const expirationTime = new Date().getTime() + tokenExpirationInMinutes * 60 * 1000;
          return {
            hash,
            expirationTime,
          };
        };
        // Generate a password reset token
        const myToken = generateToken();

        const passwordReset = new PasswordReset({
            userId: user,
            token: myToken.hash,
            isValid: true,
        });
        await passwordReset.save();

        // email template setup 
        const resetLink = `${req.protocol}://${req.get('host')}/user/reset-password/${myToken.hash}`;
        const renderedTemplate = ejs.render(passwordResetTemplate,{ resetLink , user });

        // Construct the password reset email
      const mailOptions = {
        from:process.env.SMTP_FROM_EMAIL ,
        to: user.email,
        subject: `Password Reset Request`,
        html: renderedTemplate,
      };
      // Send the email
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          res.render('forgotPassword', {
            message: { type: 'danger', text: 'There was an error sending the password reset email. Please try again later.' }
          });
        } else {
          res.render('forgotPassword', {
            message: { type: 'success', text: 'A password reset link has been sent to your email address.' }
          });
        }
      });
    }catch(error){
        return res.render('forgotPassword', { 
            message: { type: 'danger', text: 'Inernal Server Error !!..' }
        });
    }
});


//password link handelor

router.get('/reset-password/:token' , async (req,res) => {
    try{
        const { token } = req.params;
        // Look up the password reset token in the database
        const passwordReset = await PasswordReset.findOne({token});
        // If the token doesn't exist, display an error message
        if (!passwordReset) {
            return res.render('forgotPassword', { 
                 message: { type: 'danger', text: 'Invalid password reset link. Please request a new link.' }
            });
        }
        // Render the password reset form
        return res.render('resetPassword', {
            token: passwordReset.token,
            message: { type: 'success', text: 'Update Your Password Now' }
       });
    }catch(err){
    return res.render('forgotPassword', { 
        message: { type: 'danger', text: 'Internal Server Error !.' }
    });
    }
});


// // reset password updates 

router.post('/reset-password/' , async (req,res) =>  {
    try{
        const passwordReset = await PasswordReset.findOne({token : req.query.youruniqtoken});
        
        // If the token doesn't exist, display an error message
        if (!passwordReset) {
            return res.render('resetPassword', {
              token: passwordReset.youruniqtoken,
              message: { type: 'danger', text: 'Password reset Link Expired. Please request a new link.' }
            });
        }
        // If the token has expired, display an error message
        if(passwordReset.isValid){
      
            passwordReset.isValid = false; 
    
            if(req.body.password == req.body.confirm_password){
                const user = await User.findById(passwordReset.userId);
                if(user){
                    user.password = req.body.password;
                    user.confirm_password = req.body.confirm_password;
                    passwordReset.save();
                    await user.save();
                    // Redirect the user to the login page with a success message
                    return res.redirect('/login?msg=Password+reset+successfully')
                }else{
                    return response.redirect('back');
                }
            }else{
            return res.render('resetPassword', {
                token: passwordReset.token,
                message: { type: 'danger', text: 'Password and Confirm Passwrod Not Matched.' }
            });
        }
        }else{
            return res.render('forgotPassword', { 
                message: { type: 'danger', text: 'Invalid password reset Token. Please request a new Token.' }
            });
        }
    }catch(err){
        return res.render('forgotPassword', { 
            message: { type: 'danger', text: 'Internal Server Error !!!! ..Please Try Again.' }
        });
    }  
});



module.exports = router;