var mongoose = require('mongoose');

var Queue = mongoose.model('Queue', {
    placeId: {
        type: String
    },
    queueId: {
        type: String
    },
    date: {
        type: String
    },
    waitTime: {
        type: String
    },
    queueMembers: [{
        userId: {
            type: String,
            required: true

        },
        isActive: {
            type: Boolean,
            required: true
        },
        joinedAt: {
            type: Date,
            required: true
        },
        leftAt: {
            type: Date,
            required: false
        }
    }]
});

module.exports = {
    Queue
  };
  