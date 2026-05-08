import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;

  const exists = await Category.findOne({ name });

  if (exists) {
    return res.status(400).json({ message: "Category exists" });
  }

  const category = await Category.create({ name });

  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;

  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );

  res.json(updated);
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};