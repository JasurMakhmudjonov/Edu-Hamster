const prisma = require("../utils/connection");
const trueFalseTaskValidator = require("../validators/trueFalseTask.validator");
const { calculateAndApplyRewards } = require("../utils/leveling");

const createTFTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      questions,
      correctAnswers,
      timeLimit,
      rewardCoins,
      topicId,
    } = req.body;

    const { error } = trueFalseTaskValidator.createTFTaskSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const topic = await prisma.topics.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const trueFalseTask = await prisma.trueFalseTasks.create({
      data: {
        title,
        description,
        questions,
        correctAnswers,
        timeLimit,
        rewardCoins,
        topicId,
      },
    });

    res.status(201).json({
      message: "True/False task created successfully",
      data: trueFalseTask,
    });
  } catch (error) {
    next(error);
  }
};

const updateTFTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      questions,
      correctAnswers,
      timeLimit,
      rewardCoins,
      topicId,
    } = req.body;

    const { error } = trueFalseTaskValidator.updateTFTaskSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const trueFalseTask = await prisma.trueFalseTasks.findUnique({
      where: { id },
    });

    if (!trueFalseTask) {
      return res.status(404).json({ message: "True/False task not found" });
    }

    if (topicId) {
      const topic = await prisma.topics.findUnique({
        where: { id: topicId },
      });

      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
    }

    const updatedTFTask = await prisma.trueFalseTasks.update({
      where: { id },
      data: {
        title,
        description,
        questions,
        correctAnswers,
        timeLimit,
        rewardCoins,
        topicId,
      },
    });

    res.status(200).json({
      message: "True/False task updated successfully",
      data: updatedTFTask,
    });
  } catch (error) {
    next(error);
  }
};

const startTFTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trueFalseTask = await prisma.trueFalseTasks.findUnique({
      where: { id },
    });

    if (!trueFalseTask) {
      return res.status(404).json({ message: "True/False task not found" });
    }

    const userTFTask = await prisma.userTrueFalseTasks.findFirst({
      where: { userId, trueFalseTaskId: trueFalseTask.id },
    });

    if (userTFTask) {
      if (
        userTFTask.trueFalseStatus === "ACCEPTED" ||
        userTFTask.trueFalseStatus === "FAILED"
      ) {
        return res.status(200).json({
          message:
            "True/False task retake started. No additional reward coins will be awarded.",
          data: trueFalseTask,
        });
      }
    } else {
      await prisma.userTrueFalseTasks.create({
        data: {
          userId,
          trueFalseTaskId: trueFalseTask.id,
          trueFalseStatus: "PENDING",
          trueFalseStartTime: new Date(),
        },
      });
    }

    res.status(200).json({
      message: "True/False task started",
      data: trueFalseTask,
    });
  } catch (error) {
    next(error);
  }
};

const submitTFTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { userAnswers } = req.body;

    const trueFalseTask = await prisma.trueFalseTasks.findUnique({
      where: { id },
    });

    if (!trueFalseTask) {
      return res.status(404).json({ message: "True/False task not found" });
    }

    const userTrueFalseTask = await prisma.userTrueFalseTasks.findFirst({
      where: {
        userId: userId,
        trueFalseTaskId: trueFalseTask.id,
      },
    });

    if (!userTrueFalseTask) {
      return res.status(404).json({ message: "User task not found" });
    }

    const correctAnswers = trueFalseTask.correctAnswers;
    let score = 0;

    for (let i = 0; i < correctAnswers.length; i++) {
      if (correctAnswers[i] === userAnswers[i]) {
        score += 1;
      }
    }

    const percentageCorrect = (score * 100) / correctAnswers.length;
    const trueFalseStatus = percentageCorrect >= 60 ? "ACCEPTED" : "FAILED";

    let rewardCoins = 0;
    let points = 0;
    let newLevel = userTrueFalseTask.level;

    if (trueFalseStatus === "ACCEPTED" && userTrueFalseTask.trueFalseStatus === "PENDING") {
      const { actualCoins, actualPoints, newLevel } = await calculateAndApplyRewards(
        userId,
        trueFalseTask.rewardCoins,
        trueFalseTask.rewardCoins 
      );
      rewardCoins = actualCoins;
      points = actualPoints;
    }

    await prisma.userTrueFalseTasks.update({
      where: { id: userTrueFalseTask.id },
      data: {
        trueFalseStatus,  // Updated to the correct field
      },
    });

    res.status(200).json({
      message: "True/False task submitted successfully",
      data: {
        rewardCoins: rewardCoins,
        points: points,
        newLevel,
        trueFalseStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};




const showTFTask = async (req, res, next) => {
  try {
    const trueFalseTasks = await prisma.trueFalseTasks.findMany();

    return res.status(200).json({
      message: "True/False tasks found",
      data: trueFalseTasks,
    });
  } catch (error) {
    next(error);
  }
};

const showTFTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trueFalseTask = await prisma.trueFalseTasks.findUnique({
      where: { id },
    });
    if (!trueFalseTask) {
      return res.status(404).json({ message: "True/False task not found" });
    }
    res.status(200).json({
      message: "True/False task found",
      data: trueFalseTask,
    });
  } catch (error) {
    next(error);
  }
};

const removeTFTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trueFalseTask = await prisma.trueFalseTasks.findUnique({
      where: { id },
    });
    if (!trueFalseTask) {
      return res.status(404).json({ message: "True/False task not found" });
    }
    await prisma.trueFalseTasks.delete({ where: { id } });
    res.status(200).json({ message: "True/False task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTFTask,
  updateTFTask,
  startTFTask,
  submitTFTask,
  showTFTask,
  showTFTaskById,
  removeTFTask,
};
