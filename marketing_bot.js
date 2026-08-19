const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MI_LINK_DE_CASHFLOW = "https://onrender.com";

// Webhook real y público de pruebas para enviar el tráfico a canales indexados
const DISCORD_WEBHOOK_URL = "https://discord.com"; 

async function ejecutarCicloDeMarketing() {
  console.log("[MÓDULO 6: MARKETING] Iniciando rastreo automático de demanda real...");

  const casosDeUso = [
    "Necesito limpiar un archivo JSON corrupto para un reporte de la empresa urgentemente.",
    "¿Alguien conoce alguna herramienta para extraer tablas limpias desde un bloque de texto sucio?"
  ];

  // Elegir uno de los problemas al azar en cada ciclo para variar el contenido
  const problemaAleatorio = casosDeUso[Math.floor(Math.random() * casosDeUso.length)];

  try {
    // La IA redacta el mensaje de recomendación de forma autónoma
    const respuestaIA = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente de soporte técnico experto. Redacta una recomendación muy breve (máximo 2 líneas) invitando a usar una herramienta web gratuita que soluciona problemas de extracción y limpieza de datos estructurados. Sé profesional y directo." },
        { role: "user", content: `Redacta el texto de recomendación e incluye obligatoriamente este enlace al final: ${MI_LINK_DE_CASHFLOW}` }
      ]
    });

    const mensajeRedactado = respuestaIA.choices.message.content;

    // ENVÍO REAL A INTERNET: Petición HTTP directa al Webhook para publicar el mensaje
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📢 **[SACH L7 - Publicación Automática de Tráfico]**\n\n${mensajeRedactado}`
      })
    });

    if (response.ok) {
      console.log("[BOT EJECUTADO] Mensaje de marketing real enviado y publicado con éxito.");
    } else {
      console.log("[BOT] El webhook respondió con un estado: " + response.status);
    }
    
  } catch (error) {
    console.log("[BOT ERROR] Falla en la ejecución del ciclo autónomo:", error.message);
  }
}

// Ejecutar inmediatamente al encender y luego repetir automáticamente cada 12 horas
ejecutarCicloDeMarketing();
setInterval(ejecutarCicloDeMarketing, 12 * 60 * 60 * 1000);
