const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: String,
    status: String,
    incident: String,
    createdAt: { // Campo de fecha y hora
        type: Date,
        default: Date.now
    }
});

const Userdb = mongoose.model('userdb', schema);

module.exports = Userdb;
