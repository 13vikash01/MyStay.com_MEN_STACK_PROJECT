var express = require("express")
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
const { route } = require("./campgrounds");
var middlewares = require("../middlewares");

//  -------------------------------
// COMMENT ROUTES
// --------------------------------



//comments new route
router.get('/new', middlewares.isLoggedin, (req, res) => {
    Campground.findById(req.params.id, (err, data) => {
        if (err) {
            console.log("error")
        }
        else {
            res.render("comments/new", { campground: data })
        }
    })
})

//comment new post route
router.post('/', middlewares.isLoggedin, (req, res) => {
    //Lookup campground using id
    //create new comment
    //connect new comment to campground
    //redirect campground show page
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log("error")
            res.redirect("/campgrounds")
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log("err");
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("Success", "Succesfully added Comment");
                    res.redirect("/campgrounds/" + req.params.id)
                }
            })
        }
    })
})

//Comments EDIT

router.get('/:comment_id/edit',middlewares.iscomment_owner,(req,res)=>{
       Comment.findById(req.params.comment_id,(err,foundcomment)=>{
        if(err)
            {
                 res.redirect("back");
            }
            else
            {
                res.render("comments/edit",{campground_id:req.params.id,comment: foundcomment})
            }
       })
})

//COMMENT UPDATE PUT
router.put('/:comment_id',middlewares.iscomment_owner,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedcomment)=>{
        if(err)
         {
             res.redirect("back")
         }
         else
         {
             res.redirect("/campgrounds/"+req.params.id)
         }
    })
})

//DELETE COMMENT ROUTE

router.delete('/:comment_id',middlewares.iscomment_owner,(req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err)
        {
            res.send("back")
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


module.exports = router;