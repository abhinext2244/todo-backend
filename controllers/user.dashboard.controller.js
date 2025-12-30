import mongoose from "mongoose";
import Todo from "../models/todo.model.js";

export const getUserDashboard = async (req, res) => {
  try {
    // MOST IMPORTANT LINE
    const userId = new mongoose.Types.ObjectId(req.User.id);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const stats = await Todo.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          totalTodos: [{ $count: "count" }],

          completedTodos: [
            { $match: { isCompleted: true } },
            { $count: "count" }
          ],

          pendingTodos: [
            { $match: { isCompleted: false } },
            { $count: "count" }
          ],

          highPriorityTodos: [
            { $match: { priority: "High" } },
            { $count: "count" }
          ],

          todayTodos: [
            {
              $match: {
                dueDate: { $gte: startOfDay, $lte: endOfDay }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    const s = stats[0] || {};

    return res.status(200).json({
      success: true,
      data: {
        totalTodos: s.totalTodos?.[0]?.count || 0,
        completed: s.completedTodos?.[0]?.count || 0,
        pending: s.pendingTodos?.[0]?.count || 0,
        highPriority: s.highPriorityTodos?.[0]?.count || 0,
        todayTasks: s.todayTodos?.[0]?.count || 0
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
