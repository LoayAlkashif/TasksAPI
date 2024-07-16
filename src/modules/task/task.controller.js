import { Category } from "../../../database/models/category.model.js";
import { Task } from "../../../database/models/task.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

// create a new task
const createTask = catchError(async (req, res, next) => {
  const { title, type, content, shared, category } = req.body;

  if (!req.user) return next(new AppError("you are not authorized", 401));

  const task = new Task({
    title,
    type,
    content,
    shared,
    category,
    user: req.user.userId,
  });

  await task.save();

  res.status(201).json({ message: "Added", task });
});

// get tasks

const getTasks = catchError(async (req, res, next) => {
  // Pagination
  let page = req.query.page * 1 || 1;
  if (req.query.page < 0) page = 1;
  const limit = 2;
  let skip = (page - 1) * limit;

  // Filtering
  let filterObj = {};

  if (!req.user) {
    // for unathorized users
    filterObj.shared = "public";
  } else {
    // Include shared public tasks or private tasks owned by the authenticated user
    filterObj.$or = [
      { shared: "public" },
      { shared: "private", user: req.user.userId },
    ];
  }

  if (req.query.categoryName) {
    const category = await Category.findOne({ name: req.query.categoryName });
    if (category) filterObj.category = category._id;
    else {
      return res.status(404).json({ message: "Category not found" });
    }
  }

  let mongooseQuery = Task.find(filterObj)
    .skip(skip)
    .limit(limit)
    .populate(
      "user",
      "-_id -email -password -otp -otpExpire -otpVerified -createdAt"
    )
    .populate("category", "-_id -user -createdAt");

  // Sorting
  if (req.query.sort) {
    let sortedBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortedBy);
  }

  // Additional sorting by category name or shared option
  if (req.query.sortByCategoryName) {
    mongooseQuery = mongooseQuery.sort({
      categoryName: req.query.sortByCategoryName === "asc" ? 1 : -1,
    });
  }

  if (req.query.sortByShared) {
    mongooseQuery = mongooseQuery.sort({
      shared: req.query.sortByShared === "asc" ? 1 : -1,
    });
  }

  // Execute the query
  let tasks = await mongooseQuery;

  res.status(200).json({ message: "Success", page, tasks });
});

//update task
const updateTask = catchError(async (req, res, next) => {
  if (!req.user) return next(new AppError("you are not authorized", 401));

  const task = await Task.findById(req.params.id);
  if (!task) return next(new AppError("Task not found", 404));

  if (task.user.toString() !== req.user.userId.toString()) {
    return next(new AppError("Unauthorized", 403));
  }
  task.title = req.body.title || task.title;
  task.type = req.body.type || task.type;
  task.content = req.body.content || task.content;
  task.shared = req.body.shared !== undefined ? req.body.shared : task.shared;
  await task.save();
  res.status(200).json(task);

  res.status(500).json({ message: err.message });
});

//delete task
const deleteTask = catchError(async (req, res, next) => {
  if (!req.user) return next(new AppError("you are not authorized", 401));

  const task = await Task.findById(req.params.id);
  if (!task) return next(new AppError("Task not found", 404));

  if (task.user.toString() !== req.user.userId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  await task.remove();
  res.status(200).json({ message: "Task deleted successfully" });
});

export { createTask, getTasks, updateTask, deleteTask };
