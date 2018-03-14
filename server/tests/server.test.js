const expect = require("expect");
const request = require("supertest");
const app = require("./../server");
const Todo = require("./../models/todo");
const User = require("./../models/user");
const {ObjectID} = require("mongodb");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it('should create a new todo', (done) => {
    var text = "Walk the dog";
    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });

  });
  it("Should not create a new todo with invalid body data", (done) => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find({}).then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => {
          done(e);
        });
      });
  });
});

describe("GET /todos", () => {
  it("should return a json of todos", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done)
  });

});
describe("GET /Todos/:id", () => {
  it("should return doc", (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it("should return 404 if todo not found", (done) => {
    request(app)
      .get(`/todos/${(new ObjectID).toHexString()}`)
      .expect(404)
      .expect(res => {
        expect(res.body.err).toBe("Id doesn't exist");
      })
      .end(done)
  });
  it("should return 403 if invalid id", (done) => {
    request(app)
      .get(`/todos/123452`)
      .expect(403)
      .expect(res => {
        expect(res.body.err).toBe("Invalid Id");
      })
      .end(done)
  });

});

describe("Delete /todos/:id", () => {
  it("Should remove a todo", (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err){
          return done(e);
        }
        Todo.findById(hexId).then(todo => {
          expect(todo).toBe(null);
          done();
        }).catch(e => done(e));
      });
  });

  it("Should return 404 if todo not found", (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("Should return 404 if object id is invalid", (done) => {
    request(app)
      .delete(`/todos/1234`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    let body = {text: "Hell yeah", completed: true};
    request(app)
      .patch(`/todos/${todos[0]._id}`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(body.text);
        expect(res.body.completed).toBe(body.completed);
        expect(typeof res.body.completedAt).toBe('number');
      })
      .end(done)
  });

  it('Should clear completedAt when the todo is not completed', (done) => {
    let id = todos[1]._id;
    let body = {text: "Study harder and harder", completed: false}

    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(body.text);
        expect(res.body.completed).toBe(body.completed);
        expect(res.body.completedAt).toBe(null);
      })
      .end(done);
  });
});
