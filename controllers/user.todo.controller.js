import todo from "../models/todo.model.js";
import category from "../models/category.model.js";

 export const createTodo = async (req, res) => {
  try {
     const { title, description, priority, dueDate, categoryId } = req.body;
     const userId = req.User.id;
    const requiredFields = {
      title,
      description,
      priority,
      dueDate,
      categoryId,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          message: `${key} is required`,
        });
      }
    }
  const dueDateTime = new Date(dueDate);
const now = new Date();

if (dueDateTime.getTime() <= now.getTime()) {
  return res.status(400).json({
    message: "Due date & time cannot be in the past",
  });
}

    const allowedPriorities = ["Low", "Medium", "High"];
    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const categoryExists = await category.findOne({
      _id: categoryId,
      user: userId,
    });

    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
    const createdTodo = await todo.create({
      title,
      description,
      priority,
      dueDate,
      category: categoryId,
      user: userId,
    });
    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: createdTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Todo not created",
    });
    console.log("occuring while creating todo", error);
  }
};

export const getTodos = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      page = 1,
      limit = 5,
    } = req.query;

    //  Base filter (user)
    const filter = { user: req.User.id };
    const andConditions = [];

    //  Search
    if (search?.trim()) {
      andConditions.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    //  Status
    if (status === "completed") andConditions.push({ isCompleted: true });
    if (status === "pending") andConditions.push({ isCompleted: false });

    //  Priority
    if (priority) andConditions.push({ priority });
    // category
    if(category) andConditions.push({ category });
    //  Apply filters
    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    //  Pagination
    const skip = (page - 1) * limit;

    //  Query DB
    const todos = await todo
      .find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("category", "name");

    //  Count
    const totalTodos = await todo.countDocuments(filter);

    // Response
    res.status(200).json({
      success: true,
      data: todos,
      pagination: {
        totalTodos,
        totalPages: Math.ceil(totalTodos / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    console.error("Error fetching todos", error);
    res.status(500).json({
      success: false,
      message: "Todos not fetched",
    });
  }
};
export const singleTodo = async (req, res) => {
  try {
    const todoExists = await todo.findOne({
      _id: req.params.id,
      user: req.User.id,
    });
    if (!todoExists) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      data: todoExists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Todo not fetched",
    });
    console.log("occuring while fetching todo", error);
  }
}
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    //  Empty update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    //  Priority validation
    if (
      updates.priority &&
      !["Low", "Medium", "High"].includes(updates.priority)
    ) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    //  Due date validation
    if (updates.dueDate && new Date(updates.dueDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Due date cannot be in the past" });
    }

    //  Category ownership check
    if (updates.category) {
      const categoryExists = await category.findOne({
        _id: updates.category,
        user: req.User.id,
      });

      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    // Update with ownership check
    const updatedTodo = await todo.findOneAndUpdate(
      { _id: id, user: req.User.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ message: "Todo not found or not authorized" });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Failed to update todo" });
  }
};

export const deleteTodo = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTodo = await todo.findOneAndDelete({ _id: id, user: req.User.id });
      if (!deletedTodo) {
        return res
          .status(404)
          .json({ message: "Todo not found or not authorized" });
      }
      res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: deletedTodo,
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ message: "Failed to delete todo" });
    }
  };
export const updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
     
    const stodo = await todo.findById(id).populate("category", "name");
    if (!stodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    stodo.isCompleted = !stodo.isCompleted;
    await stodo.save();

    res.status(200).json({ data: stodo });
    console.log("stodo",stodo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
