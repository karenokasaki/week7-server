//ARQUIVO PRINCIPAL
import express from "express";
import * as dotenv from "dotenv";

//habilitar o servidor a ter variáveis de ambiente
dotenv.config();

//instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express();

//configurar o servidor para aceitar enviar e receber arquivos em JSON
app.use(express.json());

// o servidor subindo pro ar.
app.listen(8080, () => {
  console.log("App up and running on port http://localhost:8080");
});
