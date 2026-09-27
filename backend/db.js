const mongoose = require('mongoose');
const mongoURI="mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const connectToMongo = async () => {
    // mongoose.connectmongoURI,()=>{
    //     console.log("Connected to Mongodb Successfully");}}

    try{ await mongoose.connect(mongoURI);
        console.log("Connected to Mongodb Successfully");
    }
    catch(error){
console.error("mondo error :", error)
    }};
module.exports = connectToMongo;