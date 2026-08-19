const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN CLAVE: Indica al servidor que use y sirva la carpeta actual
app.use(express.static(__dirname));

// Configuración de la IA leyendo tu variable oculta en Render
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// REGLA DE ENTREGA: Cuando alguien entre a la URL raíz (/), mándale el index.html de inmediato
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta API real para el procesamiento de datos con la IA
app.post('/api/extract', async (req, res) => {
  const { text, token } = req.body;

  if (!token || token !== "ALUMNO_PRO_2026") {
    return res.status(401).json({ error: "Token de acceso inválido o expirado." });
  }

  if (!text) {
    return res.status(400).json({ error: "No se proporcionó ningún texto para extraer." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Eres un extractor de datos experto y preciso. Toma el texto desordenado o código proporcionado por el usuario y devuélvelo estructurado en una tabla markdown limpia o un formato JSON perfectamente legible. No agregues charlas ni explicaciones, solo entrega el resultado formateado." 
        },
        { role: "user", content: text }
      ]
    });

    res.json({ result: response.choices.message.content });
  } catch (error) {
    console.error("Error detectado en OpenAI:", error.message);
    res.status(500).json({ error: "Error interno en el motor de procesamiento de IA." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor SACH L7 activo en puerto ${PORT}`));
