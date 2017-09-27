var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(MONGOLAB_AMBER_URI || "mongodb://localhost:27017/TodoAppVol2",{useMongoClient: true});

module.exports = {mongoose};
