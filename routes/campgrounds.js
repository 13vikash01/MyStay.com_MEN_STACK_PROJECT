var express = require("express")
var router = express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middlewares = require("../middlewares")



//getting all campgrounds routes
router.get('/',(req,res)=>{

    Campground.find({},function(err,allcampgrounds){
        if(err)
        {
           console.log("Something went wrong")
        }
        else
        {
            res.render("campground/index",{campgrounds:allcampgrounds})
        }
    })
   
})

//post route for campground addition
router.post('/', middlewares.isLoggedin,(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var des = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    var newcampground = {name:name,image:image,description:des,author:author,price:price};
    //console.log(req.user) there would always be a logged in user on this add campground page
    Campground.create(newcampground,function(err,newlycreated){
            if(err)
    {
        console.log("something went wrong")
    }
    else
    {
        req.flash("success", "Successfully Added Your Hotel ");
        res.redirect('/campgrounds');
    }
}) 
})


//new campground form
router.get('/new',middlewares.isLoggedin,(req,res)=>{
    res.render("campground/new");
})


// show page for description of particular product
router.get('/:id',(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err,Foundcampground){
          if(err)
          {
              console.log("err")
          }
          else
          {
              res.render("campground/show",{campground: Foundcampground})
          }
    })
})

//EDIT ROUTE
router.get('/:id/edit',middlewares.isowner,(req,res)=>{

        Campground.findById(req.params.id,(err,foundcampground)=>{
          
                res.render("campground/edit" , {campground:foundcampground});
             
        })
})



//UPDATE ROUTE

router.put('/:id',middlewares.isowner,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.data,(err,updatedcamp)=>{
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY campground
router.delete('/:id',middlewares.isowner,(req,res)=>{
   Campground.findByIdAndRemove(req.params.id,(err)=>{
       if(err)
       {
           res.redirect("/campgrounds");
       }
       else
       {
           res.redirect("/campgrounds");
       }
   })

})


//MIDDLEWARE


module.exports = router;