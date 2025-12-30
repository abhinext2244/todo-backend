import Category from "../models/category.model.js";
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.User.id;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const exists = await Category.findOne({
      name: name.trim(),
      user: userId
    });

    if (exists) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name: name.trim(),
      user: userId
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }
console.log("occuring while creating category", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.User.id });
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.User.id; 

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const category = await Category.findOne({
      _id: id,
      user: userId 
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    category.name = name.trim();
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    console.log("error updating category", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};