import { createCategory, fetchCategories, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import express from "express";
const router = express.Router();
router.post("/categories",auth,createCategory);
router.get("/categories",auth,fetchCategories);
router.put("/categories/:id",auth,updateCategory);
router.delete("/categories/:id",auth,deleteCategory);
export default router;