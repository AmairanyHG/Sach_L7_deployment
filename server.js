const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración segura: el sistema leerá la clave de forma invisible en la nube
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/extract', async (req, res) => {
  const { text, token } = req.body;

  // Validación del token de acceso para proteger tu saldo de IA
  if (!token || token !== "ALUMNO_PRO_2026") {
    return res.status(401).json({ error: "Token de acceso inválido o expirado." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: "Eres un extractor de datos experto. Convierte el texto que te entregue el usuario a una tabla markdown limpia o formato JSON estructurado, eliminando código basura." },
        { role: "user", content: text }
      ]
    });

    res.json({ result: response.choices.message.content });
  } catch (error) {
    res.status(500).json({ error: "Error en el motor de IA." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor SACH L7 activo en puerto ${PORT}`));
