const express = require('express');
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller');

// Ruta principal
route.get('/', services.homeRoutes);

// Ruta para agregar usuario
route.get('/add-user', services.add_user);

// Ruta para actualizar usuario
route.get('/update-user', services.update_user);

// Rutas para autenticación (registro y login)
route.get('/login', services.login);              
route.post('/login', services.process_login);    
route.get('/register', services.register); 
// route.post('/register', services.process_register); 
route.post('/api/register', controller.register);
route.post('/api/login', controller.login);


// Rutas de la API para manejo de usuarios
route.post('/api/users', controller.create); // Ruta para crear usuario (si es diferente)
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);

module.exports = route;
