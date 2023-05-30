const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
//const catalogoGerman = require('./catalogo');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Crear la variable chatbotConfig
const chatbotConfig = {
  model: "text-davinci-003",
  temperature: 0.9,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
 
};

async function runCompletion(promp) {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    ...chatbotConfig, // Utilizar la variable chatbotConfig en la solicitud a la API de OpenAI
    prompt: promp, 
  });
  console.log(response);
  return response;
}

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});
// Variable global para almacenar el valor del prompt iniciado
// Código para generar el prompt utilizando el catálogo
let promptIniciado = "You are a cell phone salesperson in a conversation in Spanish.";
//for (const celular of catalogoGerman) {
   //promptIniciado += ` ${celular.nombre}: Características: ${celular.caracteristicas}. Beneficios: ${celular.beneficios}. Precios: ${celular.precios}.`;
//}
app.get('/iniciar-prompt', async (req, res) => {
    // Código para iniciar el prompt
    const {data} = await runCompletion(promptIniciado);
    console.log(data);
    
    // Establecer el valor del prompt iniciado
    promptIniciado2 = data.choices[0].text;
    
    // Imprimir mensaje en la consola
     console.log('Prompt iniciado', promptIniciado2);
    
    // Enviar el valor del prompt iniciado como respuesta al cliente
  res.send({prompt: promptIniciado2});
  });

app.get('/openai/:prompt/', async (req, res) => {
  try {
    const {data} = await runCompletion(req.params.prompt );
    console.log(data);
    // Agregar instrucción de registro
  console.log('Recibida solicitud GET a /openai con parámetros:', req.params);
    res.send(data.choices[0].text);
    
  } catch (error) {
    console.error(error);
    res.status(500).send({error: 'Ocurrió un error al llamar a la API de OpenAI'});
  }
});

app.listen(port, () => {
  console.log(`ChatBot app listening on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({error: 'Ocurrió un error en el servidor'});
});