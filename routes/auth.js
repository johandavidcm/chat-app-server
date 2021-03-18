/*
    path: 
*/

const { Router, response } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'Email no válido').notEmpty().isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], crearUsuario);

router.post('/',[
    check('email', 'Email no válido').notEmpty().isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], loginUsuario)

router.get('/renew',[
    validarJWT
], renewToken);

module.exports = router;