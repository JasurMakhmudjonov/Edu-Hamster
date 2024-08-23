const prisma = require("../utils/connection");
const exchangeItemValidator = require("../validators/exchangeItems.validator");

const createExchangeItem = async (req, res, next) => {
  try {
    const { title, description, coinPrice, categoryId } = req.body;
    const { error } = exchangeItemValidator.createExchangeItemSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const category = await prisma.exchangeItemCategories.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const existsExchangeItem = await prisma.exchangeItems.findUnique({
      where: { title },
    });
    if (existsExchangeItem) {
      return res.status(400).json({ message: "Exchange item already exists" });
    }
    const exchangeItem = await prisma.exchangeItems.create({
      data: { title, description, coinPrice, categoryId },
    });

    res.status(201).json({
      message: "Exchange item created successfully",
      data: exchangeItem,
    });
  } catch (error) {
    next(error);
  }
};

const showExchangeItems = async (req, res, next) => {
  try {
    const exchangeItems = await prisma.exchangeItems.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        coinPrice: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json({ message: "Exchange items found", data: exchangeItems });
  } catch (error) {
    next(error);
  }
};

const showExchangeItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exchangeItem = await prisma.exchangeItems.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        coinPrice: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!exchangeItem) {
      return res.status(404).json({ message: "Exchange item not found" });
    }
    res.json({ message: "Exchange item found", data: exchangeItem });
  } catch (error) {
    next(error);
  }
};

const updateExchangeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, coinPrice, categoryId } = req.body;

    const { error } = exchangeItemValidator.updateExchangeItemSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (categoryId) {
      const category = await prisma.exchangeItemCategories.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    if (title) {
      const existsExchangeItem = await prisma.exchangeItems.findFirst({
        where: {
          title,
          id: { not: id },
        },
      });
      if (existsExchangeItem && existsExchangeItem.id !== id) {
        return res
          .status(400)
          .json({ message: "Exchange item with this title already exists" });
      }
    }

    const updatedExchangeItem = await prisma.exchangeItems.update({
      where: { id },
      data: { title, description, coinPrice, categoryId },
    });

    res.status(200).json({
      message: "Exchange item updated successfully",
      data: updatedExchangeItem,
    });
  } catch (error) {
    next(error);
  }
};

const removeExchangeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exchangeItem = await prisma.exchangeItems.findUnique({
      where: { id },
    });
    if (!exchangeItem) {
      return res.status(404).json({ message: "Exchange item not found" });
    }
    await prisma.exchangeItems.delete({ where: { id } });
    res.json({ message: "Exchange item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const purchaseItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exchangeItem = await prisma.exchangeItems.findUnique({
      where: { id: itemId },
    });
    if (!exchangeItem) {
      return res.status(404).json({ message: "Exchange item not found" });
    }

    if (user.totalCoins < exchangeItem.coinPrice) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await prisma.users.update({
      where: { id: userId },
      data: { totalCoins: { decrement: exchangeItem.coinPrice } },
    });

    const item = await prisma.purchases.create({
      data: { userId, itemId },
    });

    res
      .status(201)
      .json({ message: "Item purchased successfully", data: item });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExchangeItem,
  showExchangeItems,
  showExchangeItemById,
  updateExchangeItem,
  removeExchangeItem,
  purchaseItem,
};
