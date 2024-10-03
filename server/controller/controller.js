var Userdb = require('../model/model');
var Clientdb = require('../model/model2');

const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Clientdb.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El correo ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new Clientdb({ name, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ success: true, message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al intentar registrarse.' });
    }
};


// const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    const { email, password } = req.body;

    Clientdb.findOne({ email }).then(user => {
        if (!user) {
            return res.json({ success: false, message: "Usuario no encontrado" });
        }

        // Verificar la contraseña encriptada
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                req.session.user = user; // Almacenar el usuario en la sesión
                return res.json({ success: true, message: "Inicio de sesión exitoso" });
            } else {
                return res.json({ success: false, message: "Contraseña incorrecta" });
            }
        });
    }).catch(err => {
        return res.status(500).json({ success: false, message: "Error del servidor" });
    });
};

// create and save new user
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // new user, incluyendo latitud y longitud
    const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        status: req.body.status,
        incident: req.body.incident,
        latitude: req.body.latitude, // Agregar latitud
        longitude: req.body.longitude // Agregar longitud
    });

    user
        .save(user)
        .then(data => {
            res.redirect('/add-user');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
};

// Ajustar manualmente la diferencia horaria con Lima
function adjustToLimaTime(utcDate) {
    const limaOffset = -5; // UTC-5
    const localDate = new Date(utcDate);
    localDate.setHours(localDate.getHours() + limaOffset);
    return localDate;
}

// retrieve and return all users / retrieve and return a single user
exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;

        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id });
                } else {
                    // Convertir UTC a hora de Lima
                    const limaTime = adjustToLimaTime(data.createdAt);
                    const formattedDate = limaTime.toLocaleString('es-PE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    });
                    data.formattedDate = formattedDate;
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + id });
            });
    } else {
        Userdb.find()
            .then(users => {
                users = users.map(user => {
                    const limaTime = adjustToLimaTime(user.createdAt);
                    const formattedDate = limaTime.toLocaleString('es-PE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    });
                    user.formattedDate = formattedDate;
                    return user;
                });
                res.send(users);
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error occurred while retrieving user information" });
            });
    }
};

// Update a new identified user by user id
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update can not be empty" });
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot update user with id=${id}. Maybe user was not found!` });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating user information" });
        });
};

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot delete user with id=${id}. Maybe id is wrong` });
            } else {
                res.send({ message: "User was deleted successfully!" });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Could not delete user with id=" + id });
        });
};
