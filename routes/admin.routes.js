import express from "express";
import { getAdminDashboard } from "../controllers/admin.dashboard.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.get("/dashboard", auth, authorize("ADMIN"), getAdminDashboard);

export default router;
