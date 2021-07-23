const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require("./config");

const app = express();

// connection to Mongo db
mongoose.connect(config.db.connectionUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/routeindex');


// settings
app.set('port', process.env.PORT || 3000);
app.set('views','views');
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));


// routes
app.use('/', indexRoutes);

app.listen(app.get('port'), () =>{
    console.log(`server on port ${app.get('port')}`);
})

