var expect = require("expect");
var request = require("supertest");
var {Todo} = require(".././db/models/Todo");
var {ObjectID} = require("mongodb");
var {app} = require("../server/server.js");


const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => {
    //console.log(todos);
    done();
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
        expect(res.body.todos[1].text.toBe("Second test todo"));
      })
      .end(() => {
        done();
      });
  });
});
