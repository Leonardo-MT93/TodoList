//Desestructuramos para sacar una instancia de Express
const { Router } = require('express');
const { check } = require('express-validator');
const { emailExist, existIDinUser } = require('../helpers/db-validators');
const { putUser, postUser, deleteUser, getUser} = require('../controllers/users');
const { fieldValidator, identityValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require('../middlewares/JWT-validator');

const router = Router();

router.get('/:id',[
    jwtValidator,
    identityValidator,
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existIDinUser),
], getUser);

router.put('/:id',[
    jwtValidator,
    identityValidator,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existIDinUser),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria y debe de ser mayor de 6 letras').isLength({min: 6}),
    fieldValidator
], putUser);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe introducir un correo válido').isEmail(),
    check('email').custom( emailExist ),
    check('password', 'La contraseña es obligatoria y debe de ser mayor de 6 letras').isLength({min: 6}),
    fieldValidator
],postUser);

router.delete('/:id', [   
    jwtValidator,
    identityValidator,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existIDinUser),
    fieldValidator
], deleteUser);
module.exports = router;