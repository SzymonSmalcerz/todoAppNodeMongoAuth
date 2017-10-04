const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var userSchema = new Schema({

  email : {
    type : String,
    required : true,
    unique : true,
    lowercase : true // BO INACZEJ AA@gmail.com to co innego niz aa@gmail.com
  },
  password : {
    type : String,
    required : true
  }

});

userSchema.pre('save', function(next){

  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(this.password, salt);

  this.password = hashedPassword;

  next();
});

userSchema.methods.validatePassword = async function(password){

  if(bcrypt.compareSync(password, this.password)){
    return true;
  }

  return false;

};

var User = mongoose.model('user',userSchema);



module.exports = User;
