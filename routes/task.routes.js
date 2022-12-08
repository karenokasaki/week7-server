import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAuth from "../middlewares/isAuth.js";
import LogModel from "../model/log.model.js";
import TaskModel from "../model/task.model.js";
import UserModel from "../model/user.model.js";

const taskRoute = express.Router();

taskRoute.post("/create-task", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const newTask = await TaskModel.create({
      ...req.body,
      user: req.currentUser._id,
    });

    const userUpdated = await UserModel.findByIdAndUpdate(
      req.currentUser._id,
      {
        $push: {
          tasks: newTask._id,
        },
      },
      { new: true, runValidators: true }
    );

    await LogModel.create({
      user: req.currentUser._id,
      task: newTask._id,
      status: "Uma nova tarefa foi criada",
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

taskRoute.get("/my-tasks", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const allTasks = await TaskModel.find({
      user: req.currentUser._id,
    }).populate("user");

    return res.status(200).json(allTasks);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

//update-task
taskRoute.put("/edit/:idTask", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { idTask } = req.params;

    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: idTask },
      { ...req.body },
      { new: true, runValidators: true }
    );

    await LogModel.create({
      user: req.currentUser._id,
      task: idTask,
      status: `A tarefa "${updatedTask.details}" foi atualizada.`,
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

//delete-task
taskRoute.delete(
  "/delete/:idTask",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idTask } = req.params;

      //deletei a tarefa
      const deletedTask = await TaskModel.findByIdAndDelete(idTask);

      //retirei o id da tarega de dentro da minha array TASKS
      await UserModel.findByIdAndUpdate(
        deletedTask.user,
        {
          $pull: {
            tasks: idTask,
          },
        },
        { new: true, runValidators: true }
      );

      await LogModel.create({
        task: idTask,
        user: req.currentUser._id,
        status: `A tarefa "${deletedTask.details}" foi excluída com o status ${deletedTask.status}.`,
      });

      return res.status(200).json(deletedTask);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);

taskRoute.put(
  "/complete/:idTask",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idTask } = req.params;

      const task = await TaskModel.findByIdAndUpdate(
        idTask,
        { complete: true, dateFin: Date.now() },
        { new: true, runValidators: true }
      );

      await LogModel.create({
        user: req.currentUser._id,
        task: idTask,
        status: `A tarefa "${task.details}" foi concluída!!`
      })

      return res.status(200).json(task);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);

//all-tasks
taskRoute.get("/all-tasks", async (req, res) => {
  try {
    const allTasks = await TaskModel.find({}).populate("user");

    return res.status(200).json(allTasks);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});



export default taskRoute;
