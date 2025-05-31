const express = require('express');
const router = express.Router();
const Compra = require('../models/Compra');  // Importa tu modelo Compra

// Ruta para guardar una nueva compra
router.post('/', async (req, res) => {
  try {
    const nuevaCompra = new Compra(req.body);
    await nuevaCompra.save();
    res.status(201).json({ mensaje: 'Compra guardada' });
  } catch (error) {
    console.error('Error al guardar compra:', error);
    res.status(500).json({ mensaje: 'Error al guardar la compra' });
  }
});

// Ruta para obtener el historial de compras
router.get('/', async (req, res) => {
  try {
    const compras = await Compra.find().sort({ fecha: -1 });
    res.json(compras);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ mensaje: 'Error al obtener compras' });
  }
});

// Obtener compras por ID de usuario (cliente)
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const compras = await Compra.find({ usuario: req.params.usuarioId }).sort({ fecha: -1 });
    res.json(compras);
  } catch (error) {
    console.error('Error al obtener compras del usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener compras del usuario' });
  }
});


module.exports = router;
