const mongoose=require("mongoose");
const listing=require("../models/listing.js");
const url="mongodb://127.0.0.1:27017/wandurlust";
const sahil=require("./data.js");
main().
then(()=>{
console.log("connect to db");
})
.catch((err)=>{
    console.log(err);

});



async function main(){
    await mongoose.connect(url);
    }

    const initdb= async()=>{
        await listing.deleteMany({});
        await listing.insertMany(sahil.data);
        console.log("data inserted successfully");


    }
    initdb();