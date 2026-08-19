const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de producción: la clave se lee de forma invisible desde las variables de Render
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ruta API real para recibir datos del index.html y procesarlos con GPT-4o-mini
app.post('/api/extract', async (req, res) => {
  const { text, token } = req.body;

  // Validación de seguridad para proteger tu saldo de OpenAI contra bots maliciosos
  if (!token || token !== "ALUMNO_PRO_2026") {
    return res.status(401).json({ error: "Token de acceso inválido o expirado." });
  }

  if (!text) {
    return res.status(400).json({ error: "No se proporcionó ningún texto para extraer." });
  }

  try {
    // Llamada HTTP real hacia los servidores oficiales de OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo optimizado para mantener costos ultra bajos y alto margen de ganancia
      messages: [
        { 
          role: "system", 
          content: "Eres un extractor de datos experto y preciso. Toma el texto desordenado o código proporcionado por el usuario y devuélvelo estructurado en una tabla markdown limpia o un formato JSON perfectamente legible. No agregues charlas ni explicaciones, solo entrega el resultado formateado." 
        },
        { 
          role: "user", 
          content: text 
        }
      ]
    });

    // Envío del resultado final procesado de vuelta a la página web del cliente
    res.json({ result: response.choices.message.content });
  } catch (error) {
    console.error("Error detectado en el motor de OpenAI:", error.message);
    res.status(500).json({ error: "Error interno en el motor de procesamiento de IA." });
  }
});

// Encendido del servidor en el puerto asignado automáticamente por Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor SACH L7 activo en puerto ${PORT}`));
