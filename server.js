const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const session = require('express-session'); // Importar express-session
const MongoStore = require('connect-mongo'); // Importar connect-mongo para almacenar sesiones en MongoDB

const connectDB = require('./server/database/connection');

const app = express();

dotenv.config( { path : 'config.env'} );
const PORT = process.env.PORT || 8080;

// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}));

// Configuración de la sesión
// Configuración de la sesión con almacenamiento en MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || 'cCRI1PZxZ+7CL+6/zw40dYJxhe/OXMQzqGv+OLA8k0E=', // Utilizar variable de entorno para mayor seguridad
    resave: false,
    saveUninitialized: false, // Cambiar a false si no deseas crear sesiones vacías
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI, // Usar la misma URL de conexión de MongoDB
        collectionName: 'sessions' // Nombre de la colección donde se almacenarán las sesiones
    }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // Configurar la cookie (1 día de expiración)
}));


// Configura el middleware para acceder al usuario en todas las rutas
// server.js
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


// set view engine
app.set("view engine", "ejs");

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));

// load routers
app.use('/', require('./server/routes/router'));

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
