const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    date: {
        type: Date,
        require: true,
    },
    mood: {
        type: String,
        enum: ['Happy', 'Sad' ,'Angry'],
        require: true,
        default: 'Happy',
    },
    note: {
        type:String,

    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('Mood' ,MoodSchema);