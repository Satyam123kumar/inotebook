const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://satyamkumar14416:Satyam%40123@inotebook.fqijz9t.mongodb.net/";

async function connectToMongo() {
    return mongoose.connect(mongoURI);
}



module.exports = connectToMongo;
