const prisma = require("../utils/connection");
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
      return res.status(404).json({ error: "Topic not found" });
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

    const userTask = await prisma.userTasks.findFirst({
      where: { userId, topicId: quiz.topicId },
    });

    if (userTask) {
      if (userTask.quizStatus === "ACCEPTED") {
        return res.status(400).json({
          message:
            "Quiz has already been completed and accepted.",
        });
      }

      if (userTask.quizStatus === "FAILED") {
        await prisma.userTasks.delete({
          where: {
            id: userTask.id,
          },
        });

        await prisma.userTasks.create({
          data: {
            userId,
            topicId: quiz.topicId,
            quizStatus: "PENDING",
            quizStartTime: new Date(),
          },
        });
      } else {
        await prisma.userTasks.update({
          where: { id: userTask.id },
          data: {
            quizStatus: "PENDING",
            quizStartTime: new Date(),
          },
        });
      }
    } else {
      await prisma.userTasks.create({
        data: {
          userId,
          topicId: quiz.topicId,
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

    const userTask = await prisma.userTasks.findFirst({
      where: {
        userId: userId,
        topicId: quiz.topicId,
      },
    });

    if (!userTask) {
      return res.status(404).json({ message: "User task not found" });
    }

    if (userTask.quizStatus === "ACCEPTED") {
      return res
        .status(400)
        .json({ message: "Quiz has already been completed and accepted." });
    }

    const endTime = new Date();
    const timeTaken = (endTime - new Date(userTask.quizStartTime)) / 60000;

    if (timeTaken > quiz.timeLimit) {
      await prisma.userTasks.update({
        where: { id: userTask.id },
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
    let rewardCoins = 0;

    if (quizStatus === "ACCEPTED") {
      rewardCoins = quiz.rewardCoins;

      await prisma.users.update({
        where: { id: userId },
        data: {
          totalCoins: {
            increment: rewardCoins,
          },
        },
      });
    }

    await prisma.userTasks.update({
      where: {
        id: userTask.id,
      },
      data: {
        quizStatus,
        quizStartTime: endTime,
      },
    });

    const data = {
      score,
      totalQuestions: correctAnswers.length,
      rewardCoins: quizStatus === "ACCEPTED" ? rewardCoins : 0,
      quizStatus,
    };

    res.status(200).json({
      message: "Quiz submitted successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const showQuiz = async (req, res, next) => {
  try {
    const quizes = await prisma.quizTasks.findMany();
    if (quizes.length > 0) {
      return res.status(200).json({
        message: "Quizzes found",
        data: quizes,
      });
    } else {
      return res.status(404).json({
        message: "No quizzes found",
      });
    }
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
