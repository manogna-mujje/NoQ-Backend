const express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var index = require('./routes/index');

var app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', index);

app.listen(process.env.port || 3000, function () {
    console.log('Server is listening on port 3000!');
  });


