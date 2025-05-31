const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Registro de usuario
router.post('/registro', async (req, res) => {
  const { nombre, correo, telefono, contrasena } = req.body;

  // Validación básica
  if (!nombre || !correo || !telefono || !contrasena) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  try {
    let usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'El correo ya está registrado' });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      telefono,
      contrasena,
    });

    const salt = await bcrypt.genSalt(10);
    nuevoUsuario.contrasena = await bcrypt.hash(contrasena, salt);

    await nuevoUsuario.save();

    res.status(201).json({ msg: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(401).json({ msg: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      msg: 'Login exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contrasena');
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, correo, telefono },
      { new: true }
    );
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
});

module.exports = router;
