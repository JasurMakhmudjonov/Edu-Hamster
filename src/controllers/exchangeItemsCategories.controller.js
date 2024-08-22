const prisma = require("../utils/connection");
const EICValidator = require("../validators/exchangeItemsCategories.validator");

const createEIC = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { error } = EICValidator.createEICSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const existsEIC = await prisma.exchangeItemCategories.findUnique({
      where: { name },
    });
    if (existsEIC) {
      return res
        .status(400)
        .json({ message: "Exchange item category already exists" });
    }
    const newEIC = await prisma.exchangeItemCategories.create({
      data: { name },
    });
    res.status(201).json({
      message: "Exchange item category created successfully",
      data: newEIC,
    });
  } catch (error) {
    next(error);
  }
};

const showEIC = async (req, res, next) => {
  try {
    const allEIC = await prisma.exchangeItemCategories.findMany();
    res.json({ message: "Exchange items found", data: allEIC });
  } catch (error) {
    next(error);
  }
};

const sowEICById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EIC = await prisma.exchangeItemCategories.findUnique({
      where: { id },
    });
    if (!EIC) {
      return res
        .status(404)
        .json({ message: "Exchange item category not found" });
    }
    res.json({ message: "Exchange item category found", data: EIC });
  } catch (error) {
    next(error);
  }
};

const updateEIC = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { error } = EICValidator.updateEICSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const updatedEIC = await prisma.exchangeItemCategories.update({
      where: { id },
      data: { name },
    });
    res.json({
      message: "Exchange item category updated successfully",
      data: updatedEIC,
    });
  } catch (error) {
    next(error);
  }
};

const removeEIC = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EIC = await prisma.exchangeItemCategories.findUnique({
      where: { id },
    });
    if (!EIC) {
      res.status(404).json({ message: "Exchange item category not found" });
    }
    await prisma.exchangeItemCategories.delete({ where: { id } });
    res.json({ message: "Exchange item category deleted successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEIC,
  showEIC,
  sowEICById,
  updateEIC,
  removeEIC,
};
