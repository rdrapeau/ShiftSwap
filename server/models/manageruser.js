/*
    Schema for a user.
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var uniqueValidator = require('mongoose-unique-validator');

var managerUserSchema = new Schema({
    created_at: {
        // auto added user registration timestamp
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        unique: true, lowercase: true
    },
    password: {
        type: String
    },
    users : {
        type: Array,
        default: []
    },
    schedules : {
        type: Array,
        default: []
    },
    swaps : {
        type: Array,
        default: []
    }

});

managerUserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Manager', managerUserSchema);
