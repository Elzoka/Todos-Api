require("./config/config.js");
var mongoose = require("./db/mongoose");
var Todo = require("./models/todo");
var User = require("./models/user");

const _ = require("lodash");
const {ObjectID} = require("mongodb");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get("/todos", (req, res) => {
  Todo.find({}).then((todos) => {
    res.send({todos});
  }).catch(e => {
    res.status(400).send(e);
  })
});

app.get("/todos/:id", (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(403).send({err: "Invalid Id"})
  }
  Todo.findById(id).then(todo => {
    if(!todo){
      return res.status(404).send({err: "Id doesn't exist"});
    }else{
        return res.send({todo});
    }
  }).catch(e => {
    res.status(400).send();
  });
});

app.delete("/todos/:id", (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then(todo => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch(e => {
    res.status(400).send();
  })
});

app.patch("/todos/:id", (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["text", "completed"]);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
    if(!todo){
      return res.status(404).send();
    }
    res.send(todo);
  }).catch(e => {
    res.status(400).send();
  })
});


app.listen(port, () => {
  console.log(`The server is up on port ${port}`);
});

module.exports = app;
