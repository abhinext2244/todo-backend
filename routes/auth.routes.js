import express from "express";
import {login ,register,getMe,logout} from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/me",auth,getMe);
router.post("/logout",auth,logout);
export default router