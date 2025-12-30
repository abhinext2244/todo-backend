import "./config/env.js";
import express from "express";
import connectDB from "./config/database.js";
import authrouter from "./routes/auth.routes.js";
import categoryrouter from "./routes/category.routes.js";
import usertodorouter from "./routes/user.todo.routes.js";
import dashboardrouter from "./routes/user.dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app=express();
const PORT=process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());    
app.use(cors({
  origin: "https://todo-frontend-blush-psi.vercel.app/",
  // origin: "http://localhost:5173",
  credentials: true,
}));
// app.use(cors());

app.use("/api/auth",authrouter);
app.use("/api",categoryrouter);
app.use("/api/auth",usertodorouter);
app.use("/api/auth",dashboardrouter);
app.use("/api/admin", adminRoutes);

app.get("/",(req,res)=>{
    res.send("Hello from server");
})
const startServer=async()=>{
    try{
        await connectDB();
        app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));
    }catch(error){
        console.log(error);
    }   
}

startServer();
