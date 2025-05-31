const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/compras', require('./routes/compras'));
app.use('/api/ollama', require('./routes/ollama'));


 // <-- Aquí agregamos productos

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
