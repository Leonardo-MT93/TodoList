const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidator, identityValidator } = require('../middlewares/field-validator');
const { createTask, getTasks } = require('../controllers/tasks');
const { jwtValidator } = require('../middlewares/JWT-validator');
const { existIDinUser } = require('../helpers/db-validators');



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
// router.put('/:id',[
//     validarJWT,
//     // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
//     check('id', 'No es un ID de Mongo válido' ).isMongoId(),
//     check('id').custom(existeProducto),
//     // check('categoria', 'La categoria es obligatoria').not().isEmpty(),
//     validarCampos,
// ],
// actualizarProducto);

//Borrar categoria - privado - Admin
// router.delete('/:id', [
//     validarJWT,
//     esAdminRole,
//     check('id', 'No es un ID de Mongo válido' ).isMongoId(),
//     check('id').custom(existeProducto),
//     validarCampos,
// ],
// borrarProducto);
module.exports = router;