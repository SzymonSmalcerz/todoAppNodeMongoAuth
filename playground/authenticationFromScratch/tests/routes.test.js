const request = require("supertest");
const expect = require("expect");
const rewire = require("rewire");
const mocha = require("mocha");
const app = require("../app");
const {ObjectID} = require("mongodb");
const User = require("../db/models/User");
const jwt = require("jsonwebtoken");
const constans = require("../constans/constans")

var user = {
  email : "szymon@gmail.com",
  password : "123abc"
};

var verify = jwt.verify;
// describe('hooks', function(done) {
//
//
//
// });


before(async function() {

  try{
    await User.remove({});
    var newUser = new User(user);
    await newUser.save();
  }catch(err){
    throw new Error(err);
  };

});





describe("Tests for POST /users/signup", () => {

  it("it should try to signup with already taken email and fail", (done) =>{


    request(app)
      .post("/users/signup")
      .send(user)
      .expect(400)
      .expect((response) => {
        expect(response.text).toBe("email is already taken !");
      })
      .end((err,res) =>{
        if(err)
          return done(err);

          done();
      })

  })

  it("it should try to signup with new email and succes",(done) =>{

    var newUser = {
      email : "szyyyyymosssn@gmail.com",
      password : "123abcd"
    };

    var token;
    request(app)
      .post("/users/signup")
      .send(newUser)
      .expect(200)
      .expect((response) => {
      //  console.log(JSON.stringify(JSON.parse(response.text).token,null,3));
        //token = verify(JSON.parse(response.text).token, constans.SECRET_KEY);
      })
      .end((err,res) => {
        if(err) return done(err);

        done();
      });

      //console.log(token);
    //  newUserInDatabase = await User.findOne({_id : token.sub});
      // expect(newUserInDatabase.email).toBe(newUser.email);

      // done();
  })
});


describe("Tests for POST /users/signin", () => {

  it("should try to sign in with bad password", (done) =>{

    request(app)
      .post("/users/signin")
      .send({
        email : "szymon@gmail.com",
        password : "HIHUHE"
      })
      .expect(401)
      .end((err,res) =>{
        if(err) return done(err);

        done();
      })

  });


    it("should try to sign in with bad email (username)", (done) =>{

      request(app)
        .post("/users/signin")
        .send({
          email : "RANDOM_STRING_NFJSAAKSDA@gmail.com",
          password : "HIHUHE"
        })
        .expect(401)
        .end((err,res) =>{
          if(err) return done(err);

          done();
        })

    });

    it("should try to sign in with correct data", (done) =>{

      request(app)
        .post("/users/signin")
        .send(user)
        .expect(200)
        .expect((res) => {
          //console.log(JSON.parse(res.text).email);
          expect(JSON.parse(res.text).email).toBe(user.email);
        })
        .end((err,res) =>{
          if(err) return done(err);

          done();
        })

    });

});


describe("Tests for POST /users/secret", () => {

  it("should get to secret (correct data)", (done) => {

    var newUser = {
      email : "randomEmail_A12das2131@gmail.com",
      password : "123abcd"
    };
    request(app)
      .post("/users/signup")
      .send(newUser)
      .expect(200)
      .then((res) => {
        request(app)
        .get("/users/secret")
        .set('Authorization', JSON.parse(res.text).token)
        .expect(200)
        .expect((res) => {
          //console.log(res.body.email);
          expect(res.body.email).toBe(newUser.email.toLowerCase());
        })
        .end((err,res) => {
          if(err) return done(err);

          done();
        })
      })

  });

  it("shouldn't get to secret (incorrect data)", (done) => {

    request(app)
    .get("/users/secret")
    .set('Authorization', jwt.sign({

      iss: 'CodeWorkr',
      sub: new ObjectID(),
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead

    },constans.SECRET_KEY))
    .expect(401)
    .end((err,res) => {
      if(err) return done(err);

      done();
    })

  });
});
