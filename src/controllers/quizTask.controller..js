const prisma = require("../utils/connection");
const { calculateAndApplyRewards } = require("../utils/leveling");
const quizTaskValidator = require("../validators/quizTask.validator");

const createQuiz = async (req, res, next) => {
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

    const { error } = quizTaskValidator.createQuizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const topic = await prisma.topics.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const quiz = await prisma.quizTasks.create({
      data: {
        title,
        description,
        rewardCoins,
        questions,
        correctAnswers,
        timeLimit,
        topicId,
      },
    });

    res.status(201).json({
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req, res, next) => {
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

    const { error } = quizTaskValidator.updateQuizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const quiz = await prisma.quizTasks.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (topicId) {
      const topic = await prisma.topics.findUnique({
        where: { id: topicId },
      });

      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
    }

    const updatedQuiz = await prisma.quizTasks.update({
      where: { id },
      data: {
        title,
        description,
        rewardCoins,
        topicId,
        questions,
        correctAnswers,
        timeLimit,
      },
    });

    res.status(200).json({
      message: "Quiz updated successfully",
      data: updatedQuiz,
    });
  } catch (error) {
    next(error);
  }
};

const startQuiz = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const quiz = await prisma.quizTasks.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const userQuizTask = await prisma.userQuizTasks.findFirst({
      where: { userId, quizTaskId: quiz.id },
    });

    if (userQuizTask) {
      if (
        userQuizTask.quizStatus === "ACCEPTED" ||
        userQuizTask.quizStatus === "FAILED"
      ) {
        return res.status(200).json({
          message:
            "Quiz retake started. No additional reward coins will be awarded.",
          data: quiz,
        });
      }
    } else {
      await prisma.userQuizTasks.create({
        data: {
          userId,
          quizTaskId: quiz.id,
          quizStatus: "PENDING",
          quizStartTime: new Date(),
        },
      });
    }

    res.status(200).json({
      message: "Quiz started",
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { userAnswers } = req.body;

    const quiz = await prisma.quizTasks.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const userQuizTask = await prisma.userQuizTasks.findFirst({
      where: {
        userId: userId,
        quizTaskId: quiz.id,
      },
    });

    if (!userQuizTask) {
      return res.status(404).json({ message: "User task not found" });
    }

    const endTime = new Date();
    const timeTaken = (endTime - new Date(userQuizTask.quizStartTime)) / 60000;

    if (timeTaken > quiz.timeLimit) {
      await prisma.userQuizTasks.update({
        where: { id: userQuizTask.id },
        data: {
          quizStatus: "FAILED",
          updatedAt: endTime,
        },
      });
      return res
        .status(400)
        .json({ message: "Time limit exceeded. Quiz failed." });
    }

    const correctAnswers = quiz.correctAnswers;
    let score = 0;

    for (let i = 0; i < correctAnswers.length; i++) {
      if (correctAnswers[i] === userAnswers[i]) {
        score += 1;
      }
    }

    const percentageCorrect = (score * 100) / correctAnswers.length;
    const quizStatus = percentageCorrect >= 60 ? "ACCEPTED" : "FAILED";

    if (quizStatus === "ACCEPTED" && userQuizTask.quizStatus === "PENDING") {
      const { actualCoins, actualPoints, newLevel } =
        await calculateAndApplyRewards(
          userId,
          quiz.rewardCoins,
        );

      res.status(200).json({
        message: "Quiz submitted successfully",
        data: {
          score,
          totalQuestions: correctAnswers.length,
          rewardCoins: actualCoins,
          points: actualPoints,
          newLevel,
          quizStatus,
        },
      });
    } else {
      res.status(200).json({
        message: "Quiz submitted successfully",
        data: {
          score,
          totalQuestions: correctAnswers.length,
          rewardCoins: 0,
          points: 0,
          quizStatus,
        },
      });
    }

    await prisma.userQuizTasks.update({
      where: { id: userQuizTask.id },
      data: {
        quizStatus,
        quizStartTime: endTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

const showQuiz = async (req, res, next) => {
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

    const quizes = await prisma.quizTasks.findMany({
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
        questions: true,
        correctAnswers: true,
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

    const totalQuizes = await prisma.quizTasks.count({ where });

    res.status(200).json({
      message: "Quizzes found",
      data: quizes,
      pagination: {
        total: totalQuizes,
        offset: parseInt(offset, 10),
        limit: take,
        totalPages: Math.ceil(totalQuizes / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

const showQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quizTasks.findUnique({ where: { id } });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json({
      message: "Quiz found",
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

const removeQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quizTasks.findUnique({ where: { id } });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    await prisma.quizTasks.delete({ where: { id } });
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  updateQuiz,
  startQuiz,
  submitQuiz,
  showQuiz,
  showQuizById,
  removeQuiz,
};
