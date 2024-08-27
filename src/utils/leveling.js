const prisma = require("./connection");

const pointsPerLevel = 250;
const baseMultiplier = 1.0;
const multiplierIncrement = 0.1;

/**
 * @param {number} level
 * @returns {object}
 */
const getLevelConfig = (level) => {
  const maxPoints = pointsPerLevel * level;
  const multiplier = baseMultiplier + (level - 1) * multiplierIncrement;
  return { maxPoints, multiplier };
};

/**
 * @param {string} userId
 * @param {number} baseCoins
 * @param {number} basePoints
 */
const calculateAndApplyRewards = async (userId, baseCoins) => {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const { maxPoints, multiplier } = getLevelConfig(user.level);

  const actualCoins = Math.floor(baseCoins * multiplier);
  const actualPoints = Math.floor((actualCoins / 10) * multiplier);

  let updatedData = {
    totalCoins: user.totalCoins + actualCoins,
    points: user.points + actualPoints,
    level: user.level,
  };

  if (updatedData.points >= maxPoints) {
    updatedData.level += 1;
    updatedData.points = updatedData.points - maxPoints;
  }

  await prisma.users.update({
    where: { id: userId },
    data: updatedData,
  });

  return {
    actualCoins,
    actualPoints,
    newLevel: updatedData.level,
  };
};

module.exports = {
  getLevelConfig,
  calculateAndApplyRewards,
};
