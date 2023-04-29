const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const ejsLayouts = require('express-layouts');
const ejs = require('ejs');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const passport_local = require('./config/passport-local');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')
const connect_Flash = require('connect-flash');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000 ;
const jwt = require('jsonwebtoken');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
// data base
const ConnectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/MOOD_TRACKER');
        console.log(`MongoDB connected  successfull : ${conn.connection.host}`);
    }catch(err){
        console.log(`Error In Connecting MongoDB: ${err}`);
        process.exit(1);
    }
};

app.use(expressSession({
    secret:process.env.JWT_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {maxAge:1000* 60 * 60 * 24},
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/MOOD_TRACKER',
        ttl:  24 * 60 * 60 , // 1 day
        autoRemove: 'disabled'
    })
}));
app.use(connect_Flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('assets'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(ejsLayouts);
app.set('layout extractStyles' ,true);
app.set('layout extractScripts' , true);

// routers and use
app.use('/' ,require('./routers'));

ConnectDB().then(() => {
    app.listen(PORT,()=> {
        console.log(`Successfull Connected With the Port:${PORT}`);
    });
});
