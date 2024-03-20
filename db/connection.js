const mongoose = require("mongoose");

// const encodedUri = encodeURIComponent(process.env.MONGODB_URI);
const connection = async () => {
  try {
    console.log("URI is " + process.env.MONGODB_URI);
    const conn = await mongoose.connect(
      "mongodb+srv://Tarun:tarun0508@cluster0-2qgfp.mongodb.net/SE-project?retryWrites=true&w=majority",
      {
        autoIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Mongo Error is ", error);
  }
  mongoose.connection.on("error", (err) => {
    console.log("Intermediate MongoDB error");
  });
};

module.exports = connection;
