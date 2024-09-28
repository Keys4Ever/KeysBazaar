import express from 'express';
import turso from "./config/turso.js";
const app = express();
const port = 3000;


// Definir endpoint raíz para responder con 'Hello World!' ---> probar con yaak (abrir con npx run app.js antes)
app.get('/', async (req, res) => {
  res.send('Hello World!');
});


//Inicializar server en puerto
app.listen(port, () => {
  console.log(`Listening port on ${port}`);
});