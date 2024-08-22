const prisma = require("../utils/connection");
const spinRewardValidator = require("../validators/spinReward.validator");

const createSpinReward = async (req, res, next) => {
  try {
    const { rewardCoins } = req.body;
    const { error } = spinRewardValidator.createSpinRewardSchema.validate(
      req.body
    );

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const spinReward = await prisma.spinRewards.create({
      data: {
        rewardCoins,
      },
    });

    res
      .status(201)
      .json({ message: "Spin rewader created successfully", data: spinReward });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    next(error);
  }
};

const showSpinReward = async (req, res, next) => {
  try {
    const spinRewards = await prisma.spinRewards.findMany();

    res.status(200).json({ message: "Spin rewards found", data: spinRewards });
  } catch (error) {
    next(error);
  }
};

const showSpinRewardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const spinReward = await prisma.spinRewards.findUnique({ where: { id } });
    if (!spinReward) {
      return res.status(404).json({ message: "Spin reward not found" });
    }
    res.status(200).json({ message: "Spin reward found", data: spinReward });
  } catch (error) {
    next(error);
  }
};

const updateSpinReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rewardCoins } = req.body;
    const { error } = spinRewardValidator.updateSpinRewardSchema.validate({
      rewardCoins,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const spinReward = await prisma.spinRewards.update({
      where: { id },
      data: { rewardCoins },
    });

    res
      .status(200)
      .json({ message: "Spin reward updated successfully", data: spinReward });
  } catch (error) {
    next(error);
  }
};

const removeSpinReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const spinReward = await prisma.spinRewards.findUnique({ where: { id } });
    if (!spinReward) {
      return res.status(404).json({ message: "Spin reward not found" });
    }
    await prisma.spinRewards.delete({ where: { id } });
    res.status(200).json({ message: "Spin reward deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const addToTotalCoins = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { rewardCoins } = req.body;

    if (!rewardCoins || typeof rewardCoins !== "number" || rewardCoins <= 0) {
      return res.status(400).json({ message: "Invalid rewardCoins value." });
    }

    await prisma.users.update({
      where: { id: userId },
      data: {
        totalCoins: {
          increment: rewardCoins,
        },
      },
    });

    res.status(200).json({ message: `Successfully added ${rewardCoins} coins to your total.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSpinReward,
  showSpinReward,
  showSpinRewardById,
  updateSpinReward,
  removeSpinReward,
  addToTotalCoins,
};
