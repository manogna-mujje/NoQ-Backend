var express = require('express');
var router = express.Router();
var cntl = require('../controllers/');

router.get('/', cntl.getHome);

router.post('/places', cntl.insertPlace);

router.patch('/places', cntl.updatePlace);

router.get('/places', cntl.getAllPlaces);

router.get('/places/:placeId', cntl.getOnePlace);

router.delete('/places', cntl.deletePlace);

router.get('/queues', cntl.getQueue);

router.post('/queues', cntl.insertQueue);

router.patch('/queues', cntl.updateWaitTime);

router.post('/queues/addUser', cntl.addUser);

router.patch('/queues/removeUser', cntl.removeUser);

router.post('/signup', cntl.signup);

router.get('/login', cntl.login);

module.exports = router;