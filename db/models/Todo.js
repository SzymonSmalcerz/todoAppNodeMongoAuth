var {mongoose} = require(".././mongoose");

var Todo = mongoose.model("Todo", {
  text : {
    type : String,
    required : true,
    trim : true,
    minlength : 1
  },
  complited : {
    type : Boolean,
    default : false
  },
  complitedAt : {
    type : Number,
    default : null
  }
});

module.exports = {Todo};
