import express from "express";
import uploadImg from "../config/cloudnary.config.js";

const uploadRoute = express.Router();

uploadRoute.post("/upload", uploadImg.single("picture"), (req, res) => {
  // onde está o arquivo que eu acabei de fazer o upload o cloudnary?
  // req.file -> que está as informações da foto carregada

  //confirmar que a imagem foi carregada corretamente
  if (!req.file) {
    return res.status(400).json({ msg: "Upload Fail" });
  }

  return res.status(201).json({ url: req.file.path });
});

export default uploadRoute;
