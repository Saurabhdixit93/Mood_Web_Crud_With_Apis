const express = require('express');
const bcryptJs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();


// api for create user 
router.post('/v1/auth/register' , async (req , res) => {
    try{
        const { email, password ,name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcryptJs.hash(password, 10);

        const newUser = await new User({
          name,  
          email,
          password: hashedPassword
        });
    
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        return res.status(200).json({
            message: 'User Created Successfull, Below Your Token',
            token
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error , Creating User Account'
        });
    }
});

router.post('/v1/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
  
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
    
        const passwordMatch = await bcryptJs.compare(password, user.password);
  
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Incorrect password' });
        }
  
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({
            message: 'User Login Successfull, Below Your Token',
            token
        });
    }catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Internal Server Error , Creating User Account'
     });
    }
});
  
  module.exports = router;