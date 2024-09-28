var Userdb = require('../model/model');

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
