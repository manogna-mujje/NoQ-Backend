var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:password1@ds233806.mlab.com:33806/noq');
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true );

module.exports = {
  mongoose: mongoose
};
