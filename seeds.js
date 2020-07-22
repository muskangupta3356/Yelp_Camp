var mongoose = require("mongoose");
var Campground = require("./models/campground");
 var Comment = require("./models/comment");


var data= [
    {
        name: "Cloud's Rest",
        image:"https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer porttitor rutrum nulla, eget sollicitudin metus ullamcorper a. In hac habitasse platea dictumst. Sed non dignissim justo. Morbi fringilla, est ac facilisis pellentesque, enim risus sagittis lorem, eget auctor libero risus nec mi. Aliquam erat volutpat. Nullam faucibus dignissim leo sed ultrices. Suspendisse quis lacus porttitor, cursus augue a, consequat felis. Etiam justo tellus, molestie nec eros id, mattis scelerisque diam. Fusce eu tristique magna, sed malesuada sem. Fusce sollicitudin blandit mauris vitae facilisis. Nunc molestie rutrum sagittis. Nullam dictum id augue vel dignissim. Praesent venenatis vestibulum fermentum."
    },

    {
        name:" Desert mesa",
        image:"https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
        description:" ahemahemahemahem"
    },
    {
        name:" Canon evolve",
        image:"https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
        description: "yuffyuygudu7gugdGUDUGUUYF"


    }

];

function seedDB(){
   //Remove all campgrounds
    Campground.remove({},function(err){
        if(err)
        {
            console.log(err);
        }
        console.log("removed campgrounds!");
        
   //add  a few campgrounds

    data.forEach(function(seed){
        Campground.create(seed, function(err,campground){
            if(err){
                console.log(err);
            }
            else{
              console.log("added a campground");
               //add a few comment
               Comment.create(
                   {
                       text:"This place is great, but i wish there was internet" ,
                       author: "Homer"
                   },function(err,comment){
                       if(err){
                           console.log(err);
                       }
                      else{
                       campground.comments.push(comment);
                       campground.save();
                        console.log("created new comment"+comment);
                      }
                   }
               );
                
            }
        });
    });
    });

};


  


module.exports = seedDB;


