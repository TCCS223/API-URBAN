const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/usuarios');

router.get('/usuarios', UsuariosController.listarUsuarios);
router.post('/usuarios', UsuariosController.cadastrarUsuarios);
router.put('/usuarios/:usu_id', UsuariosController.editarUsuarios);
router.delete('/usuarios/:usu_id', UsuariosController.apagarUsuarios);
router.patch('/usuarios/:usu_id/ocultar', UsuariosController.ocultarUsuario);
router.post('/login', UsuariosController.login);

module.exports = router;
