const mongoose = require('mongoose')
const config = require('config')

const db = config.get('MongoURI')

const connectDB = async() => {
    try{
        await mongoose.connect(db,{
            useNewUrlParser : true,
            // useCreateIndex: true
        });
        console.log(`Mongo DB is connected....`);
    }catch(err){
        console.log("Could not connect ...")
        console.log(`error is: ${err}`)
        process.exit(1) //exit the process with failure
    }
}
module.exports = connectDB;