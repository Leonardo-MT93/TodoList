const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidator, taskIdentityValidator } = require('../middlewares/field-validator');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/tasks');
const { jwtValidator } = require('../middlewares/JWT-validator');
const { existIDinUser, existTask } = require('../helpers/db-validators');



const router = Router();

// Obtener todas las categorias - publico
// router.get('/',  obtenerProductos);
router.get('/:id', [
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existIDinUser),
    fieldValidator,
],
getTasks
);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    jwtValidator,
    check('name', 'El nombre de la tarea es obligatorio').not().isEmpty(),
 fieldValidator
], createTask);

//Actualizar un registro por id - privado - cualquier persona con un token válido
router.put('/:id',[
    jwtValidator,
    taskIdentityValidator,
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existTask),
    check('name', 'El nombre de la tarea es obligatorio').not().isEmpty(),
    fieldValidator,
],
updateTask);

router.delete('/:id', [
    jwtValidator,
    taskIdentityValidator,
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existTask),
    fieldValidator,
],
deleteTask);
module.exports = router;