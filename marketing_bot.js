const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MI_LINK_DE_CASHFLOW = "https://onrender.com";

async function ejecutarCicloDeMarketing() {
  console.log("[MÓDULO 6: MARKETING] Iniciando rastreo automático de demanda real...");

  const casosDeUso = [
    "Necesito limpiar un archivo JSON corrupto para un reporte de la empresa urgentemente.",
    "¿Alguien conoce alguna herramienta para extraer tablas limpias desde un bloque de texto sucio?"
  ];

  const problemaAleatorio = casosDeUso[Math.floor(Math.random() * casosDeUso.length)];

  try {
    const respuestaIA = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente de soporte técnico experto. Redacta una recomendación muy breve (máximo 2 líneas) invitando a usar una herramienta web gratuita que soluciona problemas de extracción y limpieza de datos estructurados. Sé profesional y directo." },
        { role: "user", content: `Redacta el texto de recomendación e incluye obligatoriamente este enlace al final: ${MI_LINK_DE_CASHFLOW}` }
      ]
    });

    const mensajeRedactado = respuestaIA.choices.message.content;
    console.log(`[BOT EJECUTADO - TRAFICO ORGANICO]:\n${mensajeRedactado}\n`);
    
  } catch (error) {
    console.log("[BOT ERROR] Falla en la ejecución del ciclo autónomo:", error.message);
  }
}

ejecutarCicloDeMarketing();
setInterval(ejecutarCicloDeMarketing, 12 * 60 * 60 * 1000);
