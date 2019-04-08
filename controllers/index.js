require('../db/mongoose');
var modelPlace = require ('../models/place');
var modelQueue = require ('../models/queue');
var Place = modelPlace.Place;
var Queue = modelQueue.Queue;

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
            res.status(404).send("No data exists for this email.");
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
        queueId: req.body.queueId,
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

function getTodaysDate() {
    var sysdate = new Date();
    var date =  sysdate.getFullYear().toString() + "-" + (sysdate.getMonth()+1).toString() + "-" + (sysdate.getDate()+1).toString()  ;
    return date;
}

module.exports = {
    getHome,
    insertPlace,
    updatePlace,
    getAllPlaces,
    getOnePlace,
    deletePlace,
    insertQueue,
    updateWaitTime,
    addUser,
    removeUser
}