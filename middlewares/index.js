var Campground  = require("../models/campground");
var Comment     = require("../models/comment");


var middlewareObj={};


middlewareObj.isLoggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You have to Sign up/login first!");
    res.redirect("/register");
}


middlewareObj.isowner = function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,(err,foundcampground)=>{
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                if(foundcampground.author.id.equals(req.user._id))
                {
                   next();
                }
                else
                {
                    req.flash("error", "You don't have access to do that!");
                    res.redirect("back");
                }
            }
        })
    }
    else
    {
        req.flash("error", "You have to login first!");
        res.redirect("back");
    }
}



middlewareObj.iscomment_owner = function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id,(err,foundcomment)=>{
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                if(foundcomment.author.id.equals(req.user._id))
                {
                   next();
                }
                else
                {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        })
    }
    else
    {
        res.redirect("back");
    }
}



module.exports = middlewareObj;