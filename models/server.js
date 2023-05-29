const express = require('express')
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

class Server {
    constructor(){
        this.app = express();
        //Hacemos que el puerto sea visible
        this.port = process.env.PORT;
        //Forma simplificada
        this.paths = {
            auth: '/api/auth',
            // search: '/api/search',
            users: '/api/users',
            // categories: '/api/categories',
            tasks: '/api/tasks',
            // uploads: '/api/uploads'
        }
        // this.usuariosPath = '/api/users';
        // this.authPath = '/api/auth';

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares son funciones que agregan otra funcionalidad al webserver. Se ejecutan siempre que levantamos el servidor
        this.middlewares();
        //Configuramos las rutas llamando al metodo
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        // this.app.use(cors());
        // Middleware para parseo y lectura del BODY

        this.app.use( express.json());
        //Directorio publico -- Implementamos nuestra carpeta pública
        this.app.use( express.static('public')) // palabra clave use para definir un middleware
        //FileUpload - O carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //Para crear las carpetas que no existan y reciban nuestros archivos
        }));
    }

    //Metodo para definir rutas
    routes(){
        //Middleware condicional que comienza con el path /api/users = this.usuariosPath
        
        this.app.use(this.paths.auth, require('../routes/auth'));
        // this.app.use(this.paths.categories, require('../routes/categories'));
        // this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.tasks, require('../routes/task'));
        this.app.use(this.paths.users, require('../routes/user'));
        // this.app.use(this.paths.uploads, require('../routes/uploads'));
    }



    //Metodo para escuchar
    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }


}

module.exports = Server;