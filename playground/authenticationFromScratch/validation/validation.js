const joi = require("joi");
//const bodyParser = require("body-parser");


module.exports = {
  validateSignUp : (schema) => {
    return (req,res,next) => {


      var result = joi.validate(req.body,schema);


      if(result.error){
        res.status(400).send(`valdiation error: ${result.error}`);
      }

      req.value = result.value;

      next();
    };
  },
  schemaSignUp : joi.object().keys({
    email : joi.string().email().required(),
    password : joi.string().min(5).max(30).required()
  })
};
