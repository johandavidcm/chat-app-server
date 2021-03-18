const bcrypt = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require('../helpers/jwt');
const { response } = require('express');

const crearUsuario = async(req, res = response) => {
    try {
        const { email, password } = req.body;
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        return res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const loginUsuario = async(req, res = response) => {
    try {
        const { email, password } = req.body;
        const usuarioDB = await Usuario.findOne({ email });
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        // validar el password
        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validarPassword){
            return res.status(404).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }
        const token = await generarJWT(usuarioDB.id);
        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    } catch (error) {
        
    }
}

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById(uid);
    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}