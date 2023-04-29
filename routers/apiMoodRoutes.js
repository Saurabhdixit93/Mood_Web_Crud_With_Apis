const express = require('express');
const Mood = require('../models/Mood');
const authenticateUser = require('../config/authMiddleForApi');

const router = express.Router();

router.get('/v1/all-moods', authenticateUser.authenticateUser, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).populate('user', '-password');
    if(moods === 0){
        return res.status(201).json({
            messge: 'No Moods Found Create New'
        });
    }

    return res.status(200).json({
        messge: 'All Moods Fetched Successfully',
        moods
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: 'Internal Server Error , Fetching Mood'
    });
  }
});



router.post('/v1/create-mood',authenticateUser.authenticateUser, async (req, res) => {
  try {
    const { date,mood,note} = req.body;

    const newMood = new Mood({
      user: req.user.id,
      date,
      mood,
      note

    });

    await newMood.save();
    return res.status(201).json({
        messge: 'New Mood Created Successfully',
        newMood
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: 'Internal Server Error , Fetching Mood'
    });
  }
});

router.delete('/v1/delete-mood/:id', authenticateUser.authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const mood = await Mood.findById(id);

    if (!mood) {
      return res.status(404).json({ error: 'Mood not found' });
    }

    if (mood.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await Mood.findByIdAndDelete(id);
    
    return res.status(204).json({
        messge: ' Mood deleted Successfully',
        mood
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error , Fetching Mood'
        });
    }
});
    
module.exports = router;