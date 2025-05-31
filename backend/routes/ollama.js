const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es requerido' });
  }

  try {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'llama3',  // Asegúrate que este modelo esté descargado en Ollama
        prompt: prompt,
        stream: false,
      },
      {
        timeout: 30000,
      }
    );

    // Validamos que la respuesta tenga el formato esperado
    if (!response.data || !response.data.response) {
      throw new Error('La respuesta de Ollama no tiene el formato esperado');
    }

    res.json({
      respuesta: response.data.response,
      modelo_usado: response.data.model || 'llama3.1:8b'
    });

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Si Ollama devuelve que el modelo no existe
    if (error.response?.data?.error?.includes("model") && error.response?.data?.error?.includes("not found")) {
      return res.status(400).json({
        error: 'Modelo no encontrado',
        detalles: 'Verifica si el modelo llama3.1:8b está instalado usando "ollama run llama3.1:8b" o "ollama pull llama3.1:8b"'
      });
    }

    res.status(500).json({
      error: 'Error al procesar tu solicitud',
      detalles: error.message,
    });
  }
});

module.exports = router;
