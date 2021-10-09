const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash');
const bodyparser = require("body-parser");
const path = require('path');
const Router =  require('./server/routes/router');
const connectDB = require('./server/database/connection');

const app = express();


dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use(Router)
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('auth/index.ejs', require('./server/routes/router'));

// load routers


app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});