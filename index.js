//ARQUIVO PRINCIPAL
import express from "express";
import * as dotenv from "dotenv";
import { uuid } from "uuidv4";

//habilitar o servidor a ter variáveis de ambiente
dotenv.config();

//instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express();

//configurar o servidor para aceitar enviar e receber arquivos em JSON
app.use(express.json());

//banco de dados
const bancoDados = [
  {
    id: "764b5e8f-d6f7-4161-ac20-fa0085413844",
    name: "Karen Okasaki",
    age: 29,
    role: "professora",
    active: true,
    tasks: ["preparar aula do mongoCompass", "Crud no mongoDB"],
  },
];

//CRIAÇÃO DAS ROTAS
app.get("/enap", (req, res) => {
  // req -> request -> REQUISIÇÃO QUE VEM DO CLIENTE
  // res -> response -> RESPOSTA PARA O CLIENTE

  const bemVindo = "Bem vindo ao servidor da ENAP turma 92 - Ironhack";

  //retorna uma resposta com status de 200 e um json .....
  return res.status(200).json({ msg: bemVindo, turma: "92 web dev" });
});

//ATIVIDADE: CRIAR UMA ROTA QUE RETORNA O BANCO DE DADOS -> ROTA -> "/all-users" verbo: GET
app.get("/all-users", (req, res) => {
  return res.status(200).json(bancoDados);
});

//POST - create
app.post("/new-user", (req, res) => {
  //console.log(req.body) // => é o CORPO da minha requisição (json)
  //console.log(req.body.name) => apenas o nome

  const form = req.body;

  bancoDados.push(form);

  return res.status(201).json(bancoDados);
});

//DELETE - delete a user
app.delete("/delete/:id", (req, res) => {
  console.log(req.params.id); // req.params -> {} por isso ele pode ser DESCONTRUÍDO
  const { id } = req.params; // eu estou DESCONTRUINDO o req.params e ABRINDO o obj e acessando pelo NOME da chave

  const deleteById = bancoDados.find((user) => user.id === id);
  console.log(deleteById);
  const index = bancoDados.indexOf(deleteById);
  console.log(index);

  bancoDados.splice(index, 1);

  return res.status(200).json(bancoDados);
});

// o servidor subindo pro ar.
app.listen(process.env.PORT, () => {
  console.log(
    `App up and running on port http://localhost:${process.env.PORT}`
  );
});
