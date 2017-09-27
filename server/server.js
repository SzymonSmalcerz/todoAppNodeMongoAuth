require("../config/config");


var express = require("express");
var {mongoose} = require(".././db/mongoose");
var {Todo} = require(".././db/models/Todo");
var {User} = require(".././db/models/User");
var bodyParser = require("body-parser");
var {ObjectID} = require("mongodb");
var _ = require("underscore");


var app = express();






app.use(bodyParser.json());


app.post("/todos", (req,res) => {

  var newTodo = new Todo(req.body);

  if(req.body._id){
    Todo.findById(new ObjectID(req.body._id)).then((doc) => {
      if(doc){
        return res.status(400).send("there is already a todo with this id");
      }
    }, (e) => {
      return res.status(400).send(`someting went wrong : ${e}`);
    });
    if(!ObjectID.isValid(req.body._id)){
      return res.status(400).send("id is not valid");
    }
  };

  newTodo.save().then(() => {
    return res.redirect("/todos");
  }).catch((e) => {
    return res.status(400).send(`someting went wrong : ${e}`);
  });

});


app.get("/todos", (req,res) => {

  Todo.find().then((todos) => {
    res.status(200).send({todos});
  }).catch((e) => {
    console.log("something went wrong ",e);
    res.status(400).send("error while fetching data from db");
  });

});

app.get("/todos/:id", (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(404).send("couldn't get todo with this id");
  };


  Todo.findById(new ObjectID(id)).then((doc) => {

    if(!doc){
      return res.status(404).send(`couldn't get todo with this id`);
    }

    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(`something went wrong \n${e}`);
  });

});

app.delete("/todos/:id",(req,res) => {

  if(!ObjectID.isValid(req.params.id))
    return res.status(404).send(`id has bad format`);

  Todo.findByIdAndRemove(new ObjectID(req.params.id)).then((doc) => {
      if(!doc)
        return res.status(404).send(`couldn't get todo with this id`);

      res.status(200).redirect("/todos");

  }).catch((e) => res.status(400).send("something is wrong"));

});

app.patch("/todos/:id", (req,res) => {


  if(!ObjectID.isValid(req.params.id))
    return res.status(404).send("bad format of _id");


  var body = _.pick(req.body,["text","complited"]);



  if(_.isBoolean(body.complited) && body.complited) {
    body.complitedAt = Date.now();
    body.complited = true;
  }else{
    body.complitedAt = null;
    body.complited = false;
  }

  Todo.findByIdAndUpdate(req.params.id, { $set : {
    complited : body.complited,
    complitedAt : body.complitedAt
  } }).then((doc) => {
    if(!doc)
      return res.status(404).send(`couldn't get todo with this id`);

    res.status(200).redirect("/todos");

  }).catch((e) => res.status(400).send("something is wrong"));


});

app.get("*",(req,res) => {
  res.redirect("/todos");
});

app.listen(process.env.PORT, () => {   
  console.log("server listening at port ", process.env.PORT);
});

module.exports = {app};
