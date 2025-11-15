const express=require("express");
const app=express();
const mongoose=require("mongoose");
const url="mongodb://127.0.0.1:27017/wandurlust";
const path=require("path");
const listing = require("./models/listing.js");
const ejs=require("ejs");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const review=require("./models/review.js");


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
 })


