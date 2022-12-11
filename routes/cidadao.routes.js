import express from "express";
//import TaskModel from '../model/task.model.js';

import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
//
// !------------------
import CidadaoModel from "../model/cidadao.model.js";
const cidadaoRoute = express.Router();
//
// ! sort acessibilidade, mudar 'nenhuma'-> " - "
//
cidadaoRoute.get("/all-cidadaos", isAuth, async (req, res) => {
  try {
    // ? const noLocal = 'noLocal';
    const filter = {};
    const projection = { createdAt: 0 };
    const sort = {
      updatedAt: 1,
    };

    const cidadaos = await CidadaoModel.find({
      projection,
      sort,
    }).populate("acessos");

    //console.log(cidadaos, 'cidadaos');

    return res.status(200).json(cidadaos);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});
//
// ! reincluir isAuth
cidadaoRoute.post("/create-cidadao/", async (req, res) => {
  try {
    const newCidadao = await CidadaoModel.create({ ...req.body });

    return res.status(201).json(newCidadao);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});
//
//
// //
cidadaoRoute.get("/oneCidadao/:cidadaoId", isAuth, async (req, res) => {
  try {
    const { cidadaoId } = req.params;

    const cidadao = await CidadaoModel.findById(cidadaoId);

    return res.status(200).json(cidadao);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});
//
//

export default cidadaoRoute;
/*
 */
