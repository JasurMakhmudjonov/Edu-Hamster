const prisma = require("../utils/connection");
const readingTaskValidator = require("../validators/readingTask.validator");

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
    const readingTasks = await prisma.readingTasks.findMany({
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

    if (readingTasks.length > 0) {
      res
        .status(200)
        .json({ message: "Reading tasks found", data: readingTasks });
    } else {
      res.status(404).json({ message: "No reading tasks found" });
    }
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

    res.status(200).json({
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

    const userTask = await prisma.userReadingTasks.findFirst({
      where: { userId: userId, readingTaskId: readingTask.id },
    });
    if (!userTask) {
      return res.status(404).json({ message: "User task not found" });
    }

    const endTime = new Date();
    const timeTaken = (endTime - new Date(userTask.readingStartTime)) / 60000;

    let readingStatus;
    let rewardCoins = 0;

    if (timeTaken < readingTask.timeLimit) {
      readingStatus = "FAILED";
    } else {
      readingStatus = "ACCEPTED";
    }

    if (readingStatus === "ACCEPTED" && userTask.readingStatus === "PENDING") {
      rewardCoins = readingTask.rewardCoins;

      await prisma.users.update({
        where: { id: userId },
        data: {
          totalCoins: {
            increment: rewardCoins,
          },
        },
      });
    }

    await prisma.userReadingTasks.update({
      where: { id: userTask.id },
      data: {
        readingStatus,
        readingStartTime: endTime,
      },
    });

    const data = {
      rewardCoins:
        readingStatus === "ACCEPTED" && userTask.readingStatus === "PENDING"
          ? rewardCoins
          : 0,
      readingStatus,
    };

    res.status(200).json({
      message: "Reading task submitted successfully",
      data,
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
