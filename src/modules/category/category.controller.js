import { Category } from "../../../database/models/category.model.js";
import { Task } from "../../../database/models/task.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const addCategory = catchError(async (req, res, next) => {
  // if user unauthorized
  if (!req.user) return next(new AppError("you are not authorized", 401));

  // if category exist with this user only
  const category = await Category.findOne({
    name: req.body.name,
    user: req.user.userId,
  });
  if (category) return next(new AppError("Category already Exist", 409));

  // add new category
  const { name } = req.body;
  const newCategory = new Category({ name, user: req.user.userId });
  await newCategory.save();
  res.status(201).json({ message: "added", newCategory });
});

// get user categories
const getCategories = catchError(async (req, res, next) => {
  const categories = await Category.find({ user: req.user.userId });
  res.status(200).json({ message: "all categories", categories });
});

// update user category
const updateCategory = catchError(async (req, res, next) => {
  if (!req.user) return next(new AppError("you are not authorized", 401));

  const category = await Category.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.userId,
    },
    { name: req.body.name },
    { new: true }
  );
  if (!category) return next(new AppError("Category not Found", 404));

  res.status(200).json({ message: "updated", category });
});

//delete user category
const deleteCategory = catchError(async (req, res, next) => {
  if (!req.user) return next(new AppError("you are not authorized", 401));

  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!category) return next(new AppError("Category not Found", 404));
  // delete all tasks related to this category
  await Task.deleteMany({ category: req.params.id });

  res.status(200).json({ message: "Category Deleted" });
});

export { addCategory, getCategories, updateCategory, deleteCategory };
