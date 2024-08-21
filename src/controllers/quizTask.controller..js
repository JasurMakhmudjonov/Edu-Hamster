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
    let rewardCoins = 0;

    if (quizStatus === "ACCEPTED" && userQuizTask.quizStatus === "PENDING") {
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

    await prisma.userQuizTasks.update({
      where: {
        id: userQuizTask.id,
      },
      data: {
        quizStatus,
        quizStartTime: endTime,
      },
    });

    const data = {
      score,
      totalQuestions: correctAnswers.length,
      rewardCoins:
        quizStatus === "ACCEPTED" && userQuizTask.quizStatus === "PENDING"
          ? rewardCoins
          : 0,
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
