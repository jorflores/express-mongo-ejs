const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
var cookieParser = require("cookie-parser")
var session = require('express-session');
var flash = require("connect-flash");
var dotenv = require("dotenv");

dotenv.config();

const app = express();


// connection to Mongo db
mongoose.connect(process.env.MONGODB_HOST,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

// importing routescls
const indexRoutes = require('./routes/routeindex');

// settings

app.set('views','views');
app.set('view engine', 'ejs');

// middlewares

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'myscret',
    resave: false,
    saveUninitialized:false
}))
app.use(flash());

// variables globales
// middleware para mensajes
app.use((req, res, next) => {
    app.locals.messages = req.flash('message');
    next();
});

// routes
app.use('/', indexRoutes);

app.listen(process.env.PORT, () =>{
    console.log(`server on port ${app.get('port')}`);
})


