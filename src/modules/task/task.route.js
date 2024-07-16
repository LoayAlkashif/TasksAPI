import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./task.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const taskRouter = Router();

taskRouter.post("/", verifyToken, createTask);
taskRouter.get("/", verifyToken, getTasks);
taskRouter
  .route("/:id")
  .put(verifyToken, updateTask)
  .delete(verifyToken, deleteTask);

export default taskRouter;
