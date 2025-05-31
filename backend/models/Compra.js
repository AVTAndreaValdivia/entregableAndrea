const mongoose = require('mongoose');

const productoCompraSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  cantidad: { type: Number, required: true },
});

const compraSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  productos: [productoCompraSchema],
  total: { type: Number, required: true }, // Total de la compra
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Compra', compraSchema);
