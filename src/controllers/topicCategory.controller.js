const topicCategoryValidator = require("../validators/topicCategory.validator");
const prisma = require("../utils/connection");

const createTopicCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { error } = topicCategoryValidator.createTopicCategorySchema.validate(
      req.body
    );

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const existsCategory = await prisma.topicCategories.findUnique({
      where: { name },
    });

    if (existsCategory) {
      return res.status(400).json({ message: "Topic category already exists" });
    }

    const category = await prisma.topicCategories.create({
      data: { name },
    });

    res
      .status(201)
      .json({ message: "Topic category created successfully", data: category });
  } catch (error) {
    next(error);
  }
};

const showTopicCategories = async (req, res, next) => {
  try {
    const allCategories = await prisma.topicCategories.findMany();
    if (!allCategories) {
      return res.status(404).json({ message: "No topic categories found" });
    }
    res
      .status(200)
      .json({ message: "All topic categories", data: allCategories });
  } catch (error) {
    next(error);
  }
};

const showTopicCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.topicCategories.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: "Topic category not found" });
    }
    res.status(200).json({ message: "Topic category found", data: category });
  } catch (error) {
    next(error);
  }
};

const updateTopicCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { error } = topicCategoryValidator.updateTopicCategorySchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const existsTopicCategory = await prisma.topicCategories.findUnique({
      where: { id },
    });

    if (!existsTopicCategory) {
      return res.status(404).json({ message: "Topic category not found" });
    }
    const category = await prisma.topicCategories.update({
      where: { id },
      data: { name },
    });

    res
      .status(200)
      .json({ message: "Topic category updated successfully", data: category });
  } catch (error) {
    next(error);
  }
};

const removeTopicCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existsTopicCategory = await prisma.topicCategories.findUnique({
      where: { id },
    });
    if (!existsTopicCategory) {
      return res.status(404).json({ message: "Topic category not found" });
    }
    await prisma.topicCategories.delete({ where: { id } });

    res.status(200).json({ message: "Topic category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTopicCategory,
  showTopicCategories,
  showTopicCategoryById,
  updateTopicCategory,
  removeTopicCategory,
};
