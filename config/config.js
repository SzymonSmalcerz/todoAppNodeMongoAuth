
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log("NODE_ENV: ",process.env.NODE_ENV);

if(process.env.NODE_ENV == "test"){
  process.env.PORT = 8080;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTEST";
}else if(process.env.NODE_ENV == "development"){
  process.env.PORT = 8080;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppVol2";
}
