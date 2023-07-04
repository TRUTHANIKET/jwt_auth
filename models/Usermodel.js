const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true,min:8},
    verified: {type: Boolean, default: false},
    
});

module.exports = mongoose.model('User', UserSchema);