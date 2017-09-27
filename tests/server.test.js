var {app} = require("../server/server.js");
var expect = require("expect");
var request = require("supertest");
var {Todo} = require(".././db/models/Todo");
var {ObjectID} = require("mongodb");



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
        expect(res.body.todos[1].text).toBe("Second test todo");
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }

        done();
      });
  });
});

describe('POST /todos', () => {
  it('should add one todo', (done) => {
    request(app)
      .post('/todos')
      .send({
        text:"test"
      })
      .expect(302)
      .then((res) => {

        request(app)
          .get(res.res.headers.location)
          .expect(200)
          .expect((res) => {
            expect(res.body.todos.length).toBe(3);
            expect(res.body.todos[2].text).toBe("test");
          })
          .end((err,res) => {
            if(err){
              return done(err);
            }

            done();
          });

      })

  });

  it('should try to post todo with bad id', (done) => {
    request(app)
      .post('/todos')
      .send({
        text:"testt",
        _id: 100
      })
      .expect(400)
      .end((err,res) => {
        if(err){
          return done(err);
        }

        done();
      });
  });

  it('should try to post todo without "text" attribute ', (done) => {
    request(app)
      .post('/todos')
      .expect(400)
      .end((err,res) => {
        if(err){
          return done(err);
        }

        done();
      });
  });
});


describe('GET /todos:id', () => {
  it('should get one todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe("First test todo");
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }

        done();
      });
  });

  it("shouldn't get any todo (valid id but not in db)", (done) => {
    request(app)
      .get(`/todos/:${new ObjectID()}`)
      .expect(404)
      .end((err,res) => {
        if(err){
          return done(err);
        }

        done();
      });
  });

  it("shouldn't get any todo (not valid id, too short id)", (done) => {
    request(app)
      .get(`/todos/:123asdhj`)
      .expect(404)
      .end((err,res) => {
        if(err){
          return done(err);
        }

        done();
      });
  });
});


describe("DELETE /todos/:id", () => {
  it("should delete one todo", (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id}`)
      .expect(302)
      .then((res) => {

        request(app)
          .get(res.res.headers.location)
          .expect(200)
          .expect((res) => {
            expect(res.body.todos.length).toBe(1);
            expect(res.body.todos[0].text).toBe("Second test todo");
          })
          .end((err,res) => {
            if(err){
              return done(err);
            }

            done();
          });
      })
  });

  it("should try to delete todo and fail (bad format of _id)", (done) => {
    request(app)
      .delete(`/todos/aaaa2131`)
      .expect(404)
      .end((err,res) => {
        if(err){
          return done(err);
        }
        done();
      });
  });

  it("should try to delete todo and fail (_id not in database)", (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end((err,res) => {
        if(err){
          return done(err);
        }
        done();
      });
  });
});


describe("PATCH /todos:id", () => {

  it("should update one todo", (done) => {

    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send({
        complited : true
      })
      .expect(302)
      .then((res) => {

        request(app)
          .get(res.res.headers.location)
          .expect(200)
          .expect((res) => {
            expect(res.body.todos.length).toBe(2);
            expect(res.body.todos[0].complited).toBe(true);
          })
          .end((err,res) => {
            if(err){
              return done(err);
            }

            done();
          });
      })

  });


  it("should try to update one todo but fail (wrong format of _id)", (done) => {

    request(app)
      .patch("/todos/asdd")
      .expect(404)
      .expect((res) => {
        expect(res.text).toBe("bad format of _id");
        //console.log(res);
      })
      .end((err,res) =>{
        if(err)
          return done(err);

        done();
      })

  });

  it("should try to update one todo but fail (_id not in db)", (done) => {

    request(app)
      .patch(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .expect((res) => {
        expect(res.text).toBe("couldn't get todo with this id");
        //console.log(res);
      })
      .end((err,res) =>{
        if(err)
          return done(err);

        done();
      })

  });

});
