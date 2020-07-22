var express =require("express");
var app= express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Campground = require("./models/campground");
 var Comment = require("./models/comment");

var seedDB = require("./seeds");
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp" , {useNewUrlParser: true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

//passport config
app.use(require("express-session")({
     secret:"Once again Rusty wins cutest dog!",
     resave: false,
     saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//for every app
app.use(function(req,res,next){
 res.locals.currentUser = req.user;
 next();
});

app.get("/",function(req,res)
{
    res.render("landing");
});
//INDEX route-show all campgrounds

app.get("/campgrounds",function(req,res){
//  Get all campgrounds from db
    Campground.find({},function(err,allCampgrounds){
       if(err){
           console.log(err);
       }
       else{
           res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
       }
    });
});

//CREATE route - add new campground to databases
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc =req.body.description;
    var newCampground = {name: name, image: image,description:desc}
    // campgrounds.push(newCampground);
    //instead a new campground is created and saved to db
    Campground.create(newCampground,function(err,newlyCreated){
       if(err)
       {
           console.log(err);
       }
       else
       {
        res.redirect("/campgrounds");
       }
    });
    //redirect back to campgrounds page
    
});

//NEW route- show form to create new campground 
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new"); 
 });

//SHOW route - show full details of one campground when clicked

app.get("/campgrounds/:id",function(req,res){
//find the campground with the provided ID
//render show template with that campground
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err)
       {
           console.log(err);
       }
       else
       {
           console.log(foundCampground);
           res.render("campgrounds/show",{campground:foundCampground});
       }
  });

});

//============================================
//comments routes
//============================================
app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req,res){
    
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
//lookup campground using id
Campground.findById(req.params.id, function(err, campground){
  if(err){
      console.log(err);
     res.redirect("/campgrounds");
  }
  else{
     Comment.create(req.body.comment, function(err, comment){
         if(err){
console.log(err);
         }
         else{
             campground.comments.push(comment);
             campground.save();
             res.redirect("/campgrounds/"+ campground._id);
         }
     });
  }
});
//create new comment
//connect new comment to campground
//redirect campground show page
});

//=====================
//Auth Routes
//=====================

//register form
app.get("/register",function(req,res){
    res.render("register");
});

// signup logic
app.post("/register",function(req,res){
   var newUser= new User({username:req.body.username});
   User.register(newUser,req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
         passport.authenticate("local")(req,res,function(){
                  res.redirect("/campgrounds");
         });
   });
});

//show login form
app.get("/login",function(req,res){
    res.render("login");
});

// login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"

}) ,function(req,res){
});

//logout route

app.get("/logout",function(req,res){
     req.logout();
     res.redirect("/campgrounds");

});
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}





app.listen(4000,function(req,res)
{
    console.log("port 4000");
})