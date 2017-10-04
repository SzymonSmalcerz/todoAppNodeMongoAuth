const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");




const app = express();
if(process.env.NODE_ENV !== "test"){
    app.use(morgan("dev"));
};


//app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use("/users",require("./routes/users").router);



var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
})

module.exports = app;
