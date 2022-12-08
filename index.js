//ARQUIVO PRINCIPAL
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connect from "./config/db.config.js";
import userRoute from "./routes/user.routes.js";
import taskRoute from "./routes/task.routes.js";
import uploadRoute from "./routes/uploadImage.routes.js";
import logRoute from "./routes/log.routes.js";

//habilitar o servidor a ter variáveis de ambiente
dotenv.config();

//instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express();

app.use(cors());

//configurar o servidor para aceitar enviar e receber arquivos em JSON
app.use(express.json());

//conectando com o banco de dados
connect();

app.use("/user", userRoute);
app.use("/task", taskRoute);
app.use("/uploadImage", uploadRoute);
app.use("/log", logRoute)

// o servidor subindo pro ar.
app.listen(process.env.PORT, () => {
  console.log(
    `App up and running on port http://localhost:${process.env.PORT}`
  );
});
