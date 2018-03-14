require("./config/config.js");
var mongoose = require("./db/mongoose");
var Todo = require("./models/todo");
var User = require("./models/user");
var {authenticate} = require("./middleware/authenticate");

const _ = require("lodash");
const {ObjectID} = require("mongodb");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", authenticate,(req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get("/todos", authenticate,(req, res) => {
  Todo.find({
    _creator:req.user._id
  }).then((todos) => {
    res.send({todos});
  }).catch(e => {
    res.status(400).send(e);
  })
});

app.get("/todos/:id", authenticate,(req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(403).send({err: "Invalid Id"})
  }
  Todo.findOne({
    _id: id,
    _creator:req.user._id
  }).then(todo => {
    if(!todo){
      return res.status(404).send({err: "Id doesn't exist"});
    }else{
        return res.send({todo});
    }
  }).catch(e => {
    res.status(400).send();
  });
});

app.delete("/todos/:id", authenticate,(req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch(e => {
    res.status(400).send();
  })
});

app.patch("/todos/:id", authenticate,(req, res) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then(todo => {
    if(!todo){
      return res.status(404).send();
    }
    res.send(todo);
  }).catch(e => {
    res.status(400).send();
  })
});

app.post("/users", (req, res) => {
  let body = _.pick(req.body, ["email", "password"]);
  let user = new User(body);

  user.save().then(() => {
    return  user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).status(200).send(user);
  }).catch(e => {
    res.status(400).send(e);
  });
});

app.get("/users/me", authenticate,(req, res) => {
  res.send(req.user);
});

app.post("/users/login", (req, res) => {
  let body = _.pick(req.body, ["email", "password"]);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).status(200).send(user);
    });
  }).catch(e => {
    res.status(400).send();
  });
});

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
})


app.listen(port, () => {
  console.log(`The server is up on port ${port}`);
});

module.exports = app;
