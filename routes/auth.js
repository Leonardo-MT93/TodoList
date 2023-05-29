const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    fieldValidator
], login);


router.post('/google',[
    check('id_token', 'Token de Google es necesario').not().isEmpty(),
    fieldValidator
], googleSignIn);

module.exports = router;