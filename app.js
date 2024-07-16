process.on("uncaughtException", (err) => {
  console.log("Error in code", err);
});
import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { AppError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/catchError.js";
import userRouter from "./src/modules/user/user.route.js";
import categoryRouter from "./src/modules/category/category.route.js";
import dotenv from "dotenv";
import taskRouter from "./src/modules/task/task.route.js";

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/tasks", taskRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`page not found ${req.originalUrl}`, 404));
});
app.use(globalError);

process.on("unhandledRejection", (err) => {
  console.log("Error", err);
});

app.listen(port, () => console.log(`Server running on port  ${port}!`));
