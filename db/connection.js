const mongoose = require('mongoose');

const connection = async()=> {
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.log("Mongo Error is ", error);
    }
    mongoose.connection.on('error', err=>{
        console.log("Intermediate MongoDB error");
    })
    
}

module.exports = connection;
