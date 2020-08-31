var express = require("express")
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
const user = require("../models/user");

//route route
router.get('/', (req, res) => {
    res.render("landing");
})


//====ADDING AUTHENTICATION ROUTES =============

//new user signup route
router.get('/register', (req, res) => {
    res.render("register")
})


// new user signup post route
router.post('/register', (req, res) => {
    var newuser = new User({ username: req.body.username , type:req.body.type});
    User.register(newuser, req.body.password, function (err, data) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register")
        }
        else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Successfully Signed up!! , Welcome " + data.username);
                res.redirect("/campgrounds")
            })
        }
    })
})

// show login auth. form
router.get('/login', (req, res) => {
    res.render("login")
})

//handling login
router.post('/login', passport.authenticate("local",
    {
       
        successRedirect: "/campgrounds",
        failureRedirect: "/login"

    }), (req, res) => {
        
    })

// ADD Logout ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
})



module.exports = router;