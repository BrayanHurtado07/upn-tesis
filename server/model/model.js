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


// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// // Define el esquema para los clientes
// var clientSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Middleware para encriptar la contraseña antes de guardar el cliente
// clientSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// // Método para comparar la contraseña en el inicio de sesión
// clientSchema.methods.comparePassword = async function(password) {
//     return await bcrypt.compare(password, this.password);
// };

// const Clientdb = mongoose.model('clientdb', clientSchema);

// module.exports = Clientdb;
