const axios = require('axios');

// Home route to get users and render them
// exports.homeRoutes = (req, res) => {
//     // Make a GET request to the users API
//     axios.get('http://localhost:3000/api/users')
//         .then(function (response) {
//             res.render('index', { users: response.data }); // Pass users data to index view
//         })
//         .catch(err => {
//             res.render('index', { error: "Error fetching users" }); // Handle errors properly
//         });
// };

// Render the add user page
exports.add_user = (req, res) => {
    res.render('add_user'); // Render the add user form
};

// Fetch user data for update and render update user page
exports.update_user = (req, res) => {
    axios.get(`http://localhost:3000/api/users/${req.query.id}`)
        .then(function (userdata) {
            res.render('update_user', { user: userdata.data }); // Render the update form with user data
        })
        .catch(err => {
            res.render('update_user', { error: "Error fetching user data" }); // Handle errors properly
        });
};

// Render the login page
exports.login = (req, res) => {
    res.render('login'); // Render the login form
};

// Process login
// Al procesar el login exitoso
// Ruta para procesar el login del cliente
// controller.js
exports.process_login = (req, res) => {
    const { email, password } = req.body;

    Client.findOne({ email: email }, (err, user) => {
        if (err || !user) {
            return res.render('login', { error: "Credenciales inválidas" });
        }

        if (user.password === password) {
            // Guardar la sesión del usuario
            req.session.user = user;
            return res.redirect('/');
        } else {
            return res.render('login', { error: "Credenciales inválidas" });
        }
    });
};






exports.homeRoutes = (req, res) => {
    axios.get('http://localhost:3000/api/users')
        .then(function(response) {
            res.render('index', { 
                users: response.data,
                user: req.session.user // Pasamos la sesión del usuario logeado
            });
        })
        .catch(err => {
            res.send(err);
        });
};





// Render the register page
exports.register = (req, res) => {
    res.render('register'); // Render the registration form
};

// Process registration
exports.process_register = (req, res) => {
    const { name, email, password } = req.body;

    // Send a POST request to register a new user
    axios.post('http://localhost:3000/api/auth/register', { name, email, password })
        .then(function (response) {
            if (response.data.success) {
                res.redirect('/login'); // Redirect to login page on successful registration
            } else {
                res.render('register', { error: response.data.message }); // Handle registration error
            }
        })
        .catch(err => {
            res.render('register', { error: "Error al intentar registrarse" }); // Handle errors
        });
};
