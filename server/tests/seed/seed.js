const {ObjectID} = require("mongodb");
const Todo = require("./../../models/todo");
const User = require("./../../models/user");
const jwt = require("jsonwebtoken");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [{
    _id: userOneID,
    email: 'mahmoud@elzoka.com',
    password: "userOnePass",
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }, {
    _id:userTwoID,
    email: 'ahmed@darwish.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoID, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
];
const todos = [
  {
    _id: new ObjectID,
    text: "Feed the cat",
    _creator: userOneID
  },
  {
    _id: new ObjectID,
    text: "Study harder",
    completed: true,
    completedAt: 1234,
    _creator: userTwoID
  }
]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
