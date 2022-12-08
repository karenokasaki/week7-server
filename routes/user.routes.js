import express from "express";
import TaskModel from "../model/task.model.js";
import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import nodemailer from "nodemailer";

const userRoute = express.Router();

const saltRounds = 10;

//credenciais do meu email
const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    secure: false,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

//sign-up
userRoute.post("/sign-up", async (req, res) => {
  try {
    //capturand a senha do meu req.body
    const { password, email } = req.body;

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

    //configuro o corpo do email
    const mailOptions = {
      from: "turma92wd@hotmail.com", //nosso email
      to: email, //o email do usuário
      subject: "Ativação de Conta",
      html: `
        <h1>Bem vindo ao nosso site.</h1>
        <p>Por favor, confirme seu email clicando no link abaixo.</p>
        <a href=http://localhost:8080/user/activate-account/${newUser._id}>ATIVE SUA CONTA</a>
      `,
    };

    //envio do email
    //await transporter.sendMail(mailOptions);

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.get("/activate-account/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const user = await UserModel.findByIdAndUpdate(idUser, {
      confirmEmail: true,
    });

    console.log(user);

    return res.send(`Sua conta foi ativada com sucesso, ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

//login
userRoute.post("/login", async (req, res) => {
  try {
    //capturando o email e o password do req.body
    const { email, password } = req.body;

    //achar o usuário no banco de dados pelo email
    const user = await UserModel.findOne({ email: email });

    //checar se o email está confirmado
    if (user.confirmEmail === false) {
      return res
        .status(401)
        .json({ msg: "Usuário não confirmado. Por favor validar email." });
    }

    //checar se o email existe no meu banco de dados
    if (!user) {
      return res.status(400).json({ msg: "Usuário não cadastrado" });
    }

    //comparar a senha que usuário enviou com a senha hasheada que está no meu banco de dados
    //bcrypt tem um método chamado .compare(senha que usuário enviou, a senha hasheada)

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      //se a comparação for true, cai dentro desse if => as senhas são igais
      //eu tenho que devolver ao usuário um token de acesso

      //criar um token para o usuário logado
      const token = generateToken(user);

      return res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      //as senhas são diferentes!!
      return res.status(401).json({ msg: "Email ou Senha inválido" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

//profile
userRoute.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    //req.currentUser -> veio do middle attachCurrentUser

    const mailOptions = {
      from: "turma92wd@hotmail.com", //nosso email
      to: req.currentUser.email, //o email do usuário
      subject: "Você logou em nosso site",
      html: `
        <h1>Você acabou de lojar em nosso site, caso você não reconheça esse login, favor alterar sua senha imediatamente</h1>
      `,
    };

    //await transporter.sendMail(mailOptions);

    return res.status(200).json(req.currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.get(
  "/all-users",
  isAuth,
  isAdmin,
  attachCurrentUser,
  async (req, res) => {
    try {
      const users = await UserModel.find({}, { passwordHash: 0 });

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

userRoute.put("/edit", isAuth, attachCurrentUser, async (req, res) => {
  try {
    //quem é o usuário? -> req.currentUser

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.currentUser._id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.delete("/delete", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.currentUser._id);

    if (!deletedUser) {
      return res.status(400).json({ msg: "Usuário não encontrado!" });
    }

    //deletar TODAS as tarefas que o usuário é dono
    await TaskModel.deleteMany({ user: req.currentUser._id });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

/* //CREATE - MONGODB
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
}); */

//GET ALL USERS
/* userRoute.get("/all-users", async (req, res) => {
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
}); */

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

export default userRoute;
