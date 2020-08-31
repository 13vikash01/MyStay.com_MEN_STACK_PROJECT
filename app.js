require('dotenv').config()

const express           = require('express')
const bodyParser        = require('body-parser')
const passport          = require('passport')
const Localstrategy     = require('passport-local')
const flash             = require('connect-flash')
const moment            = require('moment')
const Campground        = require("./models/campground")
const Comment           = require("./models/comment")
const User              = require("./models/user")
const seedDB            = require("./seeds")
const app               = express()
const methodoverride    = require('method-override')


//Requiring Routes
var   indexRoutes       = require("./routes/index")
var   campgroundRoutes  = require("./routes/campgrounds")
var   commentRoutes     = require("./routes/comments")


//===== USES ==============
app.use(flash());

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"))

app.set("view engine","ejs");

app.use(methodoverride("_method"));

app.locals.moment = require('moment');

//=========================



//seedDB()

//====================
//Mongo setup

const mongoose = require('mongoose');
const { Db } = require('mongodb');
const campground = require('./models/campground')
const comment = require('./models/comment')
mongoose.connect('mongodb://localhost:27017/oyo_v1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//=====================

//=====================
//Passport Authentication

app.use(require("express-session")({
    secret: "Vikash is GOAT",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===================================


//=======ROUTES=================//

//Middleware
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
})

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(4444,()=>{
    console.log("server started at 4444.")
})
