const prisma = require('../utils/connection');
const { getTodayRange, getThisWeekRange, getThisMonthRange } = require('../utils/date-range');

const leaderboard = async (req, res, next) => {
  try {
    const { filter, sortBy = 'level', orderBy = 'desc', search = '', offset = 1, limit = 10 } = req.query;

    let dateRange;
    if (filter === 'today') {
      dateRange = getTodayRange();
    } else if (filter === 'this_week') {
      dateRange = getThisWeekRange();
    } else if (filter === 'this_month') {
      dateRange = getThisMonthRange();
    }

    const skip = (offset - 1) * limit;
    const take = parseInt(limit, 10);

    const where = {
      ...(dateRange && {
        updatedAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      }),
      ...(search && {
        OR: [
          { fullname: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const validSortFields = ['level', 'points', 'totalCoins'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'level';

    const leaderboardData = await prisma.users.findMany({
      where,
      orderBy: [
        { [sortField]: orderBy },
        { points: 'desc' },
        { totalCoins: 'desc' },
      ],
      select: {
        id: true,
        fullname: true,
        username: true,
        level: true,
        points: true,
        totalCoins: true,
      },
      skip,
      take,
    });

    const totalUsers = await prisma.users.count({ where });

    res.status(200).json({
      message: 'Leaderboard retrieved successfully',
      data: leaderboardData,
      pagination: {
        total: totalUsers,
        offset: parseInt(offset, 10),
        limit: take,
        totalPages: Math.ceil(totalUsers / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  leaderboard,
};
