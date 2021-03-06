require('../db/mongoose');
var modelPlace = require ('../models/place');
var modelQueue = require ('../models/queue');
var modelUser = require ('../models/user');
var Place = modelPlace.Place;
var Queue = modelQueue.Queue;
var User = modelUser.User;
var QRCode = require('qrcode');
var fs = require('fs');

var hostURL = "http://localhost:5000/"

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

var upload = require('../db/imageUploadService');

const singleUpload = upload.single('file');

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: '',
      ContentType: type.mime,
      Key: `${name}.${type.ext}`
    };
    return uploadService.s3.upload(params).promise();
  };

function generateQRCode(req, res){
  const uniqueId = req.body.uniqueid;
  const admin_Email = req.body.email;
  const PlaceName = req.body.place;

  const QRcodeValue = QRCode.toDataURL(uniqueId, function (err, url) {

      if(err) res.status(400).send("Error occured - " + err);
      const msg = {
        to: admin_Email,
        from: 'no-reply@noq.com',
        subject: 'NoQ Event QRCode',
        text: 'Text Here',
        html: 'NoQ QR Code for'+' '+'<strong>'+PlaceName+'</strong><br/>' +
        '<img src="'+hostURL+'QRCodes/'+uniqueId+'-'+Date.now()+'.png'+'" alt="QR Code" width="200" height="200"/>',
      };
      sgMail.send(msg, function(err, reply) {
        if (err) {
          return res.status(500)
            .send("There was a problem sending the email.");
        }
        res.status(200)
          .send("Mail has been successfully sent.");
      })
    });
  }

function getHome (req, res){
  res.send("Hello World");
}

function insertPlace(req, res){
  var newPlace =  new Place({
    email: req.body.email,
    name: req.body.name,
    placeId: req.body.placeId,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });
  newPlace.save().then(()=>{
    res.send("Successful").status(201);
}).catch((err)=>{
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
    }
  });
}

function signup(req, res){
  var newUser =  new User({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    role: req.body.role,
  });
  newUser.save().then(()=>{
    res.status(201).send("Successful");
}).catch((err)=>{
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
    }
  });
}

function login(req, res){
  User.findOne({
    email: req.query.email,
    password: req.query.password,
  }).then((docs)=>{
    if(docs){
      var user = {
        firstname: docs.firstname,
        lastname: docs.lastname,
        role: docs.role
      }
      res.status(200).send(user);
    } else {
      console.log("no user found");
  res.status(401).send("Email/password wrong.");
}
}).catch((err)=>{
    console.log("Err: " + err);
  res.status(400).send("Error occured!");
})
}

function updatePlace(req, res){
  var query = { placeId: req.body.placeId };
  var updates = {
    name: req.body.name,
    email: req.body.email,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  }
  Place.findOneAndUpdate(query, updates, (err, docs)=>{
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
    }
    res.status(200).send("Update successful!");
});
}

function getAllPlaces(req, res){
  Place.find({}, (err, docs)=> {
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
    }
    res.status(200).send(docs);
});
}

function getOnePlace(req, res){
  Place.findOne({placeId: req.params.placeId}).then((docs)=>{
    if(docs){
      res.status(200).send(docs);
    } else {
      res.status(404).send("No data exists for this placeId.");
}
}).catch((err)=>{
    console.log("Err: " + err);
  res.status(400).send("Error occured!");
})
}

function deletePlace(req, res){
  Place.deleteOne({placeId: req.body.placeId}, (err)=>{
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
    }
    res.status(200).send("Delete successful!");
})
}

function insertQueue(req, res){
  var newQueue =  new Queue({
    date: getTodaysDate(),
    placeId: req.body.placeId,
    waitTime: req.body.waitTime,
    queueMembers: []
  });
  newQueue.save().then((docs)=>{
    res.send(docs).status(201);
}).catch((err)=>{
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
    }
  });
}

function updateWaitTime(req, res){
  var query = {
    placeId: req.body.placeId,
    date: getTodaysDate()
  };

  var update = {
    waitTime: req.body.waitTime
  };

  Queue.findOneAndUpdate(query, update, (err, docs)=>{
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
    }
    res.status(200).send("Update successful!");
});
}

function addUser(req, res){
  var query = {
    placeId: req.body.placeId,
    date: getTodaysDate()
  };
  console.log(getTodaysDate());
  var update = {
    $push : {
      queueMembers: {
        userId: req.body.userId,
        isActive: true,
        joinedAt: new Date()
      }
    }
  }
  Queue.findOneAndUpdate(query, update, (err, docs)=>{
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
    }
    res.status(200).send("Added user into queue!!");
});

}

function removeUser(req, res){
  var query = {
    placeId: req.body.placeId,
    date: getTodaysDate(),
    "queueMembers.userId" : req.body.userId
  };

  var update = {
    $set: {
      "queueMembers.$.isActive": false,
      "queueMembers.$.leftAt" : new Date()
    }
  }
  Queue.findOneAndUpdate(query, update, (err, docs)=>{
    if(err){
      console.log("Err: " + err);
      res.status(400).send("Error occured!");
      return;
    }
    res.status(200).send("Removed user from queue!");
});
}

function getQueue(req, res){
  Queue.aggregate([{$match : {placeId: req.query.placeId}},
    { $match: {date: getTodaysDate()}},
    { $unwind: {path: '$queueMembers', includeArrayIndex: "arrayIndex" }},
    { $match: {'queueMembers.isActive':true }}])
    .project({"_id" : 0, "waitTime" : 1, "queueMembers" : 1, "arrayIndex": 1})
    .then((docs)=>{
    if(docs){
      console.log(docs);
      if(docs.length == 0) {
        Queue.find({placeId: req.query.placeId, date: getTodaysDate()}).then((result)=>{
          console.log("Result: " + result);
        res.status(200).send({"waitTime" : result[0].waitTime, "queueLength": docs.length});
      })
      } else {
        Queue.aggregate([{$match : {placeId: req.query.placeId}},
          { $match: {date: getTodaysDate()}},
          { $unwind: {path: '$queueMembers', includeArrayIndex: "arrayIndex" }},
          { $match: {'queueMembers.isActive':true, 'queueMembers.userId': req.query.userId}}])
          .project({"_id" : 0, "waitTime" : 1, "queueMembers" : 1, "arrayIndex": 1})
          .then((result)=>{
          if(result.length == 0){
          res.status(200).send({"waitTime" : docs[0].waitTime, "queueLength": docs.length});
        } else {
          res.status(200).send({"waitTime" : docs[0].waitTime, "queueLength": docs.length, "queuePosition": result[0].arrayIndex+1});
        }
      })
      }

    } else {
      res.status(404).send("No data exists for this input.");
}
}).catch((err)=>{
    res.status(400).send("Error occured - " + err);
});
}

function getMyPlaces(req, res) {
    Place.find({email: req.query.email}, (err, docs)=> {
        if(err){
            console.log("Err: " + err);
            res.status(400).send("Error occured!");
        }
        res.status(200).send(docs);
    });
}

function getTodaysDate() {
  var sysdate = new Date();
  var date =  sysdate.getFullYear().toString() + "-" + (sysdate.getMonth()+1).toString() + "-" + sysdate.getDate().toString();
  return date;
}

function uploadImage(req, res) {

  singleUpload(req, res, function(err){
      console.log(req.file);
      if (err) {
          console.log("ERROR!!!! " + err);
          return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
      }
      return res.json({
          imageURL : req.file.location,
      });
  })
}

module.exports = {
    getHome,
    insertPlace,
    updatePlace,
    getAllPlaces,
    getMyPlaces,
    getOnePlace,
    deletePlace,
    insertQueue,
    getQueue,
    updateWaitTime,
    addUser,
    removeUser,
    signup,
    login,
    generateQRCode,
    uploadImage
}