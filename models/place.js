var mongoose = require('mongoose');

var Place = mongoose.model('Place', {
  name: {
    type: String
  },
  placeId: {
    type:String
  },
  email: {
    type: String,
    trim: true,
    minlength: 1
  },
  latitude: {
      type: String
  },
  longitude: {
      type: String
  }
});

module.exports = {
  Place
};
