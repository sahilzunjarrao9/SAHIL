const mongoose=require("mongoose");
const schema=mongoose.Schema;

const listingschema=new schema({
title:{
    type:String,
    required:true,
},
price:Number,
description:String,
country:String,
location:String,
image:{
    type:String,
    set:(v)=> (v ==""?"https://media.istockphoto.com/id/1093292834/vector/photo-coming-soon-picture-frame-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=wosKG6k-JW6jI99CRtdMv1VtmSQr7hmEc4i28KxqpkY=":v),
},



});
const listing=mongoose.model("listing",listingschema);
module.exports= listing;
