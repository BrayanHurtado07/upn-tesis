// Importar dayjs
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Extender dayjs con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

var Userdb = require('../model/model');

// create and save new user
exports.create = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // new user
    const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        status: req.body.status,
        incident: req.body.incident
        // 'createdAt' se agrega automáticamente
    });

    // save user in the database
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

// retrieve and return all users / retrieve and return a single user
exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;

        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id });
                } else {
                    data.formattedDate = dayjs(data.createdAt)
                                        .tz('America/Lima') // Convertir a la zona horaria de Lima
                                        .format('DD/MM/YYYY hh:mm:ss A');
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + id });
            });
    } else {
        Userdb.find()
            .then(users => {
                // Aquí formateamos la fecha antes de enviar
                users = users.map(user => {
                    user.formattedDate = dayjs(user.createdAt)
                                        .tz('America/Lima') // Establecer la zona horaria a Lima
                                        .format('DD/MM/YYYY hh:mm:ss A'); // Formato de fecha
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
