const express=require("express");
const app=express();
const mongoose=require("mongoose");
const url="mongodb://127.0.0.1:27017/wandurlust";
const path=require("path");
const listing = require("./models/listing.js");
const User=require("./models/user.js");
const ejs=require("ejs");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const review=require("./models/review.js");
const session = require("express-session");
const flash=require("connect-flash");
const passport = require("passport");
const Localstartegy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
app.use(express.urlencoded({ extended: true })); // form data
app.use(express.json()); // optional

app.use(session({ secret: "x", resave: false, saveUninitialized: false }));
//app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
 // res.locals.success = req.flash("success");
//res.locals.error = req.flash("error");
  next();
});




main().
then(()=>{
console.log("connect to db");
})
.catch((err)=>{
    console.log(err);

});


  
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


async function main(){
    await mongoose.connect(url);
    }
app.get("/", (req,res) =>{
    res.send("hi!,i am a root");
    console.log("sau");
});


app.listen(8080,()=>{
    console.log("server is listenning to port 8080");
    console.log("server is started");
});


app.get("/listing",async (req,res)=>{
    const lists=await listing.find({});
       
  res.render("./listin/index.ejs",{ lists});
  console.log("api started");
})

app.get("/listing/new",async(req,res)=>{
    if(!req.isAuthenticated()){
       // req.flash("error","you must be logged in to create listing" );
       return res.render("./users/login.ejs");
    }
res.render("./listin/new.ejs");
})


app.get("/listing/:id",async(req,res)=>{
let { id }=req.params;
const a=await listing.findById(id).populate("reviews");
res.render("./listin/show.ejs",{ a });




})
app.post("/listings", async(req,res)=>{
const listings =req.body.listing;
const newlisting = listing(listings);
await newlisting.save();
res.redirect("/listing");

})

app.get("/listing/:id/edit",async(req,res)=>{
let { id }=req.params;
const lists=await listing.findById(id);
res.render("./listin/edit.ejs",{lists});


})
app.get("/signup" , async(req,res)=>{
    res.render("./users/signup.ejs");
})
app.post("/listing/:id/review",async(req,res)=>{
let Listing=await listing.findById(req.params.id);
let newReview=new review(req.body.review);


Listing.reviews.push(newReview);

await Listing.save();
await newReview.save();
console.log("new review saved");
let { id }=req.params;
res.redirect("/listing");

})
 app.delete("/listing/:id/reviews/:reviewId",async(req,res)=>{
    let { id , reviewId}= req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await review.findByIdAndDelete(reviewId);
res.redirect("/listing")

 });

 app.put("/listings/:id",async(req,res)=>{
let { id }=req.params;
await listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect("/listing");





 })
 


 app.delete("/listing/:id",async(req,res)=>{
   let { id }=req.params;
  await listing.findByIdAndDelete(id);
   res.redirect("/listing") ;
 });


app.post("/signup",async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser= new User({username,email});
    await User.register(newUser,password);
    //req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listing");

    }catch(e){

  //req.flash("error",e.message);
  res.redirect("/signup");
    }

});
app.get("/login",async(req,res)=>{
res.render("./users/login.ejs");


});
app.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true }),async(req,res)=>{
   // req.flash("success","welcome to wanderlust");
    res.redirect("/listing");

});
app.get("/logout",async(req,res)=>{
//req.flash("success","You are Logged out");
res.render("./users/login.ejs");
});
app.get("/navbarsignup",async(req,res)=>{
  res.render("./users/signup.ejs");
})
app.get("/navbarlogin",async(req,res)=>{
  res.render("./users/login.ejs");
})