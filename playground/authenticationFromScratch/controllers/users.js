const User = require("../db/models/User");
const constans = require("../constans/constans");
const jwt = require("jsonwebtoken");


var getToken = (user) => {

  return jwt.sign({

    iss: 'CodeWorkr',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead

  },constans.SECRET_KEY);

};


var signIn = async function(req,res,next){
  res.status(200).json(req.user);
};

var signUp = async function(req,res,next){

  try {

      var alreadyUsed = await User.findOne({email : req.value.email});

      if(alreadyUsed){
        return res.status(400).send("email is already taken !");
      };

      var newUser = new User(req.value);
      await newUser.save(req.result);
      var token = getToken(newUser);
      res.status(200).json({token});

  }catch(err){
    console.log("something went wrong !", err);
    return res.status(400).send("something went wrong !");
  };

};

var secret = async function(req,res,next){
  res.json(req.user);
};


module.exports ={
  signIn,
  signUp,
  secret
};
