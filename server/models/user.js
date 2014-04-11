/*
    Schema for a user.
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    created_at: {
        // auto added user registration timestamp
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        unique: true, lowercase: true
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ManagerUser', userSchema);
