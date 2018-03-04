const expect = require("expect");
const request = require("supertest");
const app = require("./../server");
const Todo = require("./../models/todo");
const {ObjectID} =require("mongodb");


const todos = [
  {
    _id: new ObjectID,
    text: "Feed the cat"
  },
  {
    _id: new ObjectID,
    text: "Study harder"
  }
]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done());
});

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
