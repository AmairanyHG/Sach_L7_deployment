const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Forzar la lectura de index.html sin importar dónde lo haya colocado Git
function buscarIndexHTML(dir) {
  const archivos = fs.readdirSync(dir);
  for (const archivo of archivos) {
    const rutaCompleta = path.join(dir, archivo);
    if (fs.statSync(rutaCompleta).isDirectory()) {
      if (archivo !== 'node_modules' && !archivo.startsWith('.')) {
        const encontrado = buscarIndexHTML(rutaCompleta);
        if (encontrado) return encontrado;
      }
    } else if (archivo === 'index.html') {
      return rutaCompleta;
    }
  }
  return null;
}

const rutaRaizIndex = buscarIndexHTML(__dirname) || path.join(__dirname, 'index.html');
if (fs.existsSync(rutaRaizIndex)) {
  app.use(express.static(path.dirname(rutaRaizIndex)));
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
  if (fs.existsSync(rutaRaizIndex)) {
    res.sendFile(rutaRaizIndex);
  } else {
    res.status(404).send("Error crítico: Archivo index.html no encontrado en ninguna ruta del proyecto.");
  }
});

app.post('/api/extract', async (req, res) => {
  const { text, token } = req.body;

  if (!token || token !== "ALUMNO_PRO_2026") {
    return res.status(401).json({ error: "Token de acceso inválido o expirado." });
  }

  if (!text) {
    return res.status(400).json({ error: "No se proporcionó ningún texto." });
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
