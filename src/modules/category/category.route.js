import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./category.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const categoryRouter = Router();

categoryRouter.use(verifyToken);
categoryRouter.get("/", getCategories);
categoryRouter.post("/", addCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/", deleteCategory);

export default categoryRouter;
