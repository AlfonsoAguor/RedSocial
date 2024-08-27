const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
        throw new error("No se ha podido conectar a la base de datos");
    }
}

module.exports = {
    connectDB
}