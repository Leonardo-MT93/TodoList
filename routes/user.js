//Desestructuramos para sacar una instancia de Express
const { Router } = require('express');
const { check } = require('express-validator');
const { emailExist, existIDinUser } = require('../helpers/db-validators');
const {  userPost, userPut, userDelete} = require('../controllers/users');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar.jwt');
// const {esAdminRole, tieneRole} = require('../middlewares/validar-roles');///SIMPLIFICACION
const { fieldValidator, fileValidator, identityValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require('../middlewares/JWT-validator');

const router = Router();

// router.get('/', usuariosGet);

router.put('/:id',[
    jwtValidator,
    identityValidator,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existIDinUser),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria y debe de ser mayor de 6 letras').isLength({min: 6}),
    fieldValidator
], userPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe introducir un correo válido').isEmail(),
    check('email').custom( emailExist ),
    check('password', 'La contraseña es obligatoria y debe de ser mayor de 6 letras').isLength({min: 6}),
    fieldValidator
],userPost);

router.delete('/:id', [   
    jwtValidator,
    identityValidator,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existIDinUser),
    fieldValidator
], userDelete);





module.exports = router;