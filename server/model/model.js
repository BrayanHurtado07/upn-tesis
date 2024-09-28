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
    latitude: {
        type: Number, // Nuevo campo para latitud
        required: true
    },
    longitude: {
        type: Number, // Nuevo campo para longitud
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Userdb = mongoose.model('userdb', schema);

module.exports = Userdb;
