const express = require('express');
const { check , validationResult } = require('express-validator');
const Mood = require('../models/Mood');
const passport = require('passport');
const router = express.Router({mergeParams:true});



// mood create router

router.post('/create-new-mood',passport.checkAuthentication,
[
    check('date').isISO8601(),
    check('mood').isIn(['Happy','Sad','Angry'])
], 
async (req,res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try{
        const moods = new Mood({
            user: req.user._id,
            date: req.body.date,
            mood: req.body.mood,
            note: req.body.note
          });
        await moods.save();
        return res.redirect('/mood/all-moods/?msg=Mood+Created+Successfully');
    }catch(error){
        console.log('error create mood',error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

// get all moods by user ID
router.get('/all-moods',passport.checkAuthentication , 
 async(req, res) => {
    try{
        const moods = await Mood.find({ user:req.user._id });
        if(!moods){
            return res.render('moods' ,{
                errors: "Moods Not Available Create New Or Try To login",
            });
        }
        return res.render('moods',{
            user:req.user,
            moods,
            req
        })
    }catch(error){
        return res.redirect(`/?msg=${error}`);
    }
});

// Delete mood
router.delete('/delete-mood/:id', passport.checkAuthentication, async (req, res) => {
    try {
      const mood = await Mood.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      if (!mood) {
        return res.redirect('/mood/all-moods?msg=Mood+not+found');
      }
      return res.redirect('/mood/all-moods?msg=Mood+deleted+Successfully');
    } catch (err) {
       return res.redirect(`/?msg=${err}`);
    }
});

module.exports = router;
