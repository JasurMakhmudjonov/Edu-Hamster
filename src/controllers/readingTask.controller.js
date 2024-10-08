const prisma = require("../utils/connection");
const readingTaskValidator = require("../validators/readingTask.validator");
const { calculateAndApplyRewards } = require("../utils/leveling");

const createReadingTask = async (req, res, next) => {
  try {
    const { title, description, content, timeLimit, rewardCoins, topicId } =
      req.body;
    const { error } = readingTaskValidator.createReadingTaskSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const topic = await prisma.topics.findUnique({ where: { id: topicId } });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const readingTask = await prisma.readingTasks.create({
      data: {
        title,
        description,
        content,
        timeLimit,
        rewardCoins,
        topicId,
      },
    });
    res.status(201).json({
      message: "Reading task created successfully",
      data: readingTask,
    });
  } catch (error) {
    next(error);
  }
};

const showReadingTask = async (req, res, next) => {
  try {
    const { topicId, offset = 1, limit = 10, sortBy = 'createdAt', order = 'asc' } = req.query;

    const skip = (offset - 1) * limit;
    const take = parseInt(limit, 10);

    const validSortFields = ['createdAt', 'title', 'rewardCoins', 'timeLimit'];

    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    const where = {
      ...(topicId && { topicId }),
    };

    const readingTasks = await prisma.readingTasks.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortField]: sortOrder,
      },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        timeLimit: true,
        rewardCoins: true,
        topicId: true,
        topic: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const totalReadingTasks = await prisma.readingTasks.count({ where });

    res.status(200).json({
      message: "Reading tasks found",
      data: readingTasks,
      pagination: {
        total: totalReadingTasks,
        offset: parseInt(offset, 10),
        limit: take,
        totalPages: Math.ceil(totalReadingTasks / take),
      },
    });
  } catch (error) {
    next(error);
  }
};



const showReadingTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const readingTask = await prisma.readingTasks.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        timeLimit: true,
        rewardCoins: true,
        topicId: true,
        topic: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!readingTask) {
      return res.status(404).json({ message: "Reading task not found" });
    }

    res.status(400).json({
      message: "Reading task found",
      data: readingTask,
    });
  } catch (error) {
    next(error);
  }
};

const updateReadingTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topicId, content, title, description, rewardCoins, timeLimit } =
      req.body;
    const { error } = readingTaskValidator.updateReadingTaskSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const readingTask = await prisma.readingTasks.findUnique({ where: { id } });
    if (!readingTask) {
      return res.status(404).json({ message: "Reading task not found" });
    }

    if (topicId) {
      const topic = await prisma.topics.findUnique({ where: { id: topicId } });
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
    }

    const updatedReadingTask = await prisma.readingTasks.update({
      where: { id },
      data: {
        title,
        description,
        rewardCoins,
        content,
        timeLimit,
        topicId,
      },
    });

    res.status(200).json({
      message: "Reading task updated successfully",
      data: updatedReadingTask,
    });
  } catch (error) {
    next(error);
  }
};

const removeReadingTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const readingTask = await prisma.readingTasks.findUnique({ where: { id } });
    if (!readingTask) {
      return res.status(404).json({ message: "Reading task not found" });
    }
    await prisma.readingTasks.delete({ where: { id } });
    res.status(200).json({ message: "Reading task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const startReadingTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const readingTask = await prisma.readingTasks.findUnique({ where: { id } });
    if (!readingTask) {
      return res.status(404).json({ message: "Reading task not found" });
    }

    const userTask = await prisma.userReadingTasks.findFirst({
      where: { userId, readingTaskId: readingTask.id },
    });

    if (userTask) {
      if (
        userTask.readingStatus === "ACCEPTED" ||
        userTask.readingStatus === "FAILED"
      ) {
        return res.status(200).json({
          message:
            "Reading task retake started. No additional reward coins will be awarded.",
          data: readingTask,
        });
      } else {
        await prisma.userTasks.update({
          where: { id: userTask.id },
          data: {
            readingStatus: "PENDING",
            readingStartTime: new Date(),
          },
        });
      }
    } else {
      await prisma.userReadingTasks.create({
        data: {
          userId,
          readingTaskId: readingTask.id,
          readingStatus: "PENDING",
          readingStartTime: new Date(),
        },
      });
    }

    res.status(200).json({
      message: "Reading task started",
      data: readingTask,
    });
  } catch (error) {
    next(error);
  }
};

const submitReadingTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const readingTask = await prisma.readingTasks.findUnique({ where: { id } });
    if (!readingTask) {
      return res.status(404).json({ message: "Reading task not found" });
    }

    const userReadingTask = await prisma.userReadingTasks.findFirst({
      where: { userId, readingTaskId: readingTask.id },
    });

    if (!userReadingTask) {
      return res.status(404).json({ message: "User task not found" });
    }

    const endTime = new Date();
    const timeTaken =
      (endTime - new Date(userReadingTask.readingStartTime)) / 60000;

    let readingStatus = "FAILED";
    let rewardCoins = 0;
    let points = 0;
    let newLevel = userReadingTask.level;

    if (timeTaken >= readingTask.timeLimit) {
      readingStatus = "ACCEPTED";
      const rewards = await calculateAndApplyRewards(
        userId,
        readingTask.rewardCoins,
        readingTask.rewardCoins
      );
      rewardCoins = rewards.actualCoins;
      points = rewards.actualPoints;
      newLevel = rewards.newLevel;
    }

    await prisma.userReadingTasks.update({
      where: { id: userReadingTask.id },
      data: {
        readingStatus,
        readingStartTime: endTime,
      },
    });

    res.status(200).json({
      message: "Reading task submitted successfully",
      data: {
        rewardCoins: rewardCoins,
        points: points,
        newLevel: newLevel,
        readingStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReadingTask,
  showReadingTask,
  showReadingTaskById,
  updateReadingTask,
  removeReadingTask,
  startReadingTask,
  submitReadingTask,
};
