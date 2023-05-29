require('dotenv').config();

//Llamamos la instancia de nuestro servidor creado
const Server = require('./models/server');


const server = new Server();


server.listen();

