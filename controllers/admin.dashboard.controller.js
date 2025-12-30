import User from "../models/user.model.js";
import Todo from "../models/todo.model.js";
import Category from "../models/category.model.js";

/**
 * @desc    Admin Dashboard Data
 * @route   GET /api/admin/dashboard
 * @access  Admin only
 */
export const getAdminDashboard = async (req, res) => {
  try {
    //  Total counts
    const totalUsers = await User.countDocuments();
    const totalTodos = await Todo.countDocuments();
    const totalCategories = await Category.countDocuments();

    //  Todo status stats
    const completedTodos = await Todo.countDocuments({ isCompleted: true });
    const pendingTodos = await Todo.countDocuments({ isCompleted: false });

    //  Priority stats
    const highPriority = await Todo.countDocuments({ priority: "High" });
    const mediumPriority = await Todo.countDocuments({ priority: "Medium" });
    const lowPriority = await Todo.countDocuments({ priority: "Low" });

    //  Latest users
    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    //  Latest todos
    const recentTodos = await Todo.find()
      .populate("user", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",
      data: {
        stats: {
          users: totalUsers,
          todos: totalTodos,
          categories: totalCategories,
          completedTodos,
          pendingTodos,
        },
        priorityStats: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority,
        },
        recentUsers,
        recentTodos,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data",
    });
  }
};
