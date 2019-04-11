var mongoose = require('mongoose');

var User = mongoose.model('User', {
  firstname: {
    type: String
  },
  lastname: {
    type:String
  },
  email: {
    type: String,
    trim: true,
    minlength: 1
  },
  password: {
      type: String
  }
});

module.exports = {
  User
};
