import express from "express";
import TaskModel from "../model/task.model.js";
import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";

const userRoute = express.Router();

const saltRounds = 10;

//sign-up
userRoute.post("/sign-up", async (req, res) => {
  try {
    //capturand a senha do meu req.body
    const { password } = req.body;

    //checando se a senha EXISTE || se a senha passou nos pré requisitos
    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/
      )
    ) {
      return res
        .status(400)
        .json({ msg: "Senha não tem os requisitos mínimos de segurança" });
    }

    //gerar o salt
    const salt = await bcrypt.genSalt(saltRounds); //10

    //hashear senha
    const hashedPassword = await bcrypt.hash(password, salt);

    //criar o usuário com a senha hasheada
    const newUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    //deleto a propriedade passwordHash do obj
    delete newUser._doc.passwordHash;

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

//CREATE - MONGODB
userRoute.post("/create-user", async (req, res) => {
  try {
    const form = req.body;

    //quer criar um documento dentro da sua collection -> .create()
    const newUser = await UserModel.create(form);

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

//GET ALL USERS
userRoute.get("/all-users", async (req, res) => {
  try {
    const users = await UserModel.find({}, { __v: 0, updatedAt: 0 })
      .sort({
        age: 1,
      })
      .limit(100);

    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

//GET ONE USER
userRoute.get("/oneUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // const user = await UserModel.find({_id: id})
    const user = await UserModel.findById(id).populate("tasks");

    if (!user) {
      return res.status(400).json({ msg: " Usuário não encontrado!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(400).json({ msg: "Usuário não encontrado!" });
    }

    const users = await UserModel.find();

    //deletar TODAS as tarefas que o usuário é dono
    await TaskModel.deleteMany({ user: id });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

export default userRoute;
