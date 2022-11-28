//ARQUIVO PRINCIPAL
import express from "express";
import * as dotenv from "dotenv";

//habilitar o servidor a ter variáveis de ambiente
dotenv.config();

//instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express();

//configurar o servidor para aceitar enviar e receber arquivos em JSON
app.use(express.json());

//CRIAÇÃO DAS ROTAS
app.get("/enap", (req, res) => {
  // req -> request -> REQUISIÇÃO QUE VEM DO CLIENTE
  // res -> response -> RESPOSTA PARA O CLIENTE

  const bemVindo = "Bem vindo ao servidor da ENAP turma 92 - Ironhack";

  //retorna uma resposta com status de 200 e um json .....
  return res.status(200).json({ msg: bemVindo, turma: "92 web dev" });
});

// o servidor subindo pro ar.
app.listen(process.env.PORT, () => {
  console.log(
    `App up and running on port http://localhost:${process.env.PORT}`
  );
});
