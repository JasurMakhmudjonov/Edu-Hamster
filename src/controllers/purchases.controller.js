const prisma = require("../utils/connection");

const showPurchases = async (req, res, next) => {
  try {
    const purchases = await prisma.purchases.findMany({
      select: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            username: true,
            totalCoins: true,
            points: true,
            level: true,
          },
        },
        item: {
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
        },
      },
    });
    res.json({ message: "Purchases fetched successfully", data: purchases });
  } catch (error) {
    next(error);
  }
};

const showOwnPurchases = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const purchases = await prisma.purchases.findMany({
      where: { userId: userId },
      select: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            username: true,
            totalCoins: true,
            points: true,
            level: true,
          },
        },
        item: {
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
        },
      },
    });
   
    res.json({ message: "User's purchases fetched successfully", data: purchases });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showPurchases,
  showOwnPurchases,
};
