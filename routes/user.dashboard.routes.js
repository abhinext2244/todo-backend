import {getUserDashboard}from "../controllers/user.dashboard.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import express from "express";
const router = express.Router();
router.get("/dashboard", auth, getUserDashboard);
export default router;