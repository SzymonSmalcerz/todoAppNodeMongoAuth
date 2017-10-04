var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
if(process.env.NODE_ENV === "test"){
  mongoose.connect("mongodb://localhost:27017/AuthTesting", { useMongoClient: true });
}else{
  mongoose.connect("mongodb://localhost:27017/Auth", { useMongoClient: true });
}

module.exports = mongoose;
