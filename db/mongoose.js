var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

console.log("MONGODB_URI :", process.env.MONGODB_URI);
module.exports = {mongoose};
