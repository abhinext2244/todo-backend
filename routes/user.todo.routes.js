import express from "express";
import {createTodo,getTodos,updateTodo,singleTodo,deleteTodo,updateTodoStatus} from "../controllers/user.todo.controller.js";
import {auth} from "../middleware/auth.middleware.js";
const router=express.Router();
router.post("/todos",auth,createTodo);
router.get("/todos",auth,getTodos);
router.put("/todos/:id",auth,updateTodo);
router.get("/todos/:id",auth,singleTodo);
router.delete("/todos/:id",auth,deleteTodo);
router.put("/todos/status/:id",auth,updateTodoStatus);

export default router
