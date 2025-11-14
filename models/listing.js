const mongoose=require("mongoose");
const review = require("./review");
const {Schema}=mongoose;

const listingschema=new Schema({
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
reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
}
]


})

const listing=mongoose.model("listing",listingschema);
module.exports= listing;
