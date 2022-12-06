import { expressjwt } from "express-jwt";
import * as dotenv from "dotenv"

dotenv.config()

export default expressjwt({
    secret: process.env.TOKEN_SIGN_SECRET,
    algorithms: ["HS256"]
})

// quando esse a requisição passar por esse middleware 
// será criado uma chave chamada: req.auth -> payload -> email, _id, role