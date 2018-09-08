var request = require("request");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));

// app.use(express.static(publicDir));

//Connect to mongodb
const db = "mongodb://localhost:27017/yelp_camp";
mongoose.connect(db).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//INDEX - Display a list of all the dogs

app.get("/", function(req, res){
    res.render("landing.ejs");
});


app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
             res.render("index.ejs", {campgrounds: allCampgrounds});   //The second argument is an object containing all the data we want to pass through to the ejs file.                                                                //The first name is the name we want to give it while the second is the name of what we are passing through
        }
    });
});

//NEW - Displays a form to make a new campground

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})

app.post("/campgrounds", function(req, res){
    //Get the data from the form and add to the campground's array
     var name = req.body.name;
     var image = req.body.image;
     var description = req.body.description;
     var newCampground = {name: name, image: image, description: description};

     //Create a new Campground and save to database
    // campgrounds.push(newCampground);

  Campground.create(newCampground, function(err, newlyCreated){

      if(err){
          console.log("Incorrect input")
      }else{
          //Redirect back to the campround's page
           res.redirect("/campgrounds");
      }
  })

});

app.get("/campgrounds/:id", function(req, res){

    //Find campground with specified id
    Campground.findById(req.params.id, function(err, foundCampground){

        if(err){
            console.log(err);
        } else{
            //Display show template with that campground
            res.render("show.ejs", {campground: foundCampground});
        }
    });

});

app.listen(8080);
