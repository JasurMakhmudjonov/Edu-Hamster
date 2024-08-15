const prisma = require("../utils/connection");
const quizTaskValidator = require("../validators/quizTask.validator");

const createQuiz = async (req, res, next) => {
  try {
    const { taskId, questions, correctAnswers, timeLimit } = req.body;

    const { error } = quizTaskValidator.createQuizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const task = await prisma.tasks.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const quiz = await prisma.quizTasks.create({
      data: {
        taskId,
        questions: JSON.stringify(questions),
        correctAnswers: JSON.stringify(correctAnswers),
        timeLimit,
      },
    });

    res.status(201).json({
      message: "Quiz created successfully",
      data: {
        id: quiz.id,
        title: task.title,
        description: task.description,
        rewardCoins: task.rewardCoins,
        questions: JSON.parse(quiz.questions),
        correctAnswers: JSON.parse(quiz.correctAnswers),
        timeLimit: quiz.timeLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { taskId, questions, correctAnswers, timeLimit } = req.body;
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

    const task = await prisma.tasks.findFirst({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedQuiz = await prisma.quizTasks.update({
      where: { id },
      data: {
        taskId,
        questions: JSON.stringify(questions),
        correctAnswers: JSON.stringify(correctAnswers),
        timeLimit,
      },
    });

    res.status(200).json({
      message: "Quiz updated successfully",
      data: {
        id: updatedQuiz.id,
        taskId: updatedQuiz.taskId,
        questions: JSON.parse(updatedQuiz.questions),
        correctAnswers: JSON.parse(updatedQuiz.correctAnswers),
        timeLimit: updatedQuiz.timeLimit,
      },
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    next(error);
  }
};

const startQuiz = async (req, res, next) => {
  try {
    const { id } = req.params; 

    const quiz = await prisma.quizTasks.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await prisma.taskVerifications.deleteMany({
      where: {
        taskId: quiz.taskId,
        userId: req.user.id,
      },
    });

    const updatedQuiz = await prisma.quizTasks.update({
      where: { id },
      data: {
        startTime: new Date(),
      },
    });

    res.status(200).json({
      message: "Quiz started",
      data: updatedQuiz,
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
    next(error);
  }
};


const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userAnswers } = req.body;

    const quiz = await prisma.quizTasks.findUnique({
      where: { id },
      include: { task: true },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const endTime = new Date();
    const timeTaken = (endTime - new Date(quiz.startTime)) / 1000;

    if (timeTaken > quiz.timeLimit) {
      await prisma.taskVerifications.create({
        data: {
          taskId: quiz.taskId,
          userId: req.user.id,
          verificationStatus: "FAILED",
          verifiedAt: endTime,
        },
      });
      return res.status(400).json({ message: "Time limit exceeded. Quiz failed." });
    }

    const correctAnswers = JSON.parse(quiz.correctAnswers);
    let score = 0;

    for (let i = 0; i < correctAnswers.length; i++) {
      if (correctAnswers[i] === userAnswers[i]) {
        score += 1;
      }
    }

    const percentageCorrect = (score * 100) / correctAnswers.length;
    const verificationStatus = percentageCorrect >= 60 ? "VERIFIED" : "FAILED";
    let rewardCoins = 0;

    if (verificationStatus === "VERIFIED") {
      rewardCoins = quiz.task.rewardCoins;

      await prisma.users.update({
        where: { id: req.user.id },
        data: {
          coins: {
            increment: rewardCoins,
          },
        },
      });
    }

    const existingVerification = await prisma.taskVerifications.findFirst({
      where: {
        taskId: quiz.taskId,
        userId: req.user.id,
      },
    });

    if (existingVerification) {
      await prisma.taskVerifications.update({
        where: {
          id: existingVerification.id,
        },
        data: {
          verificationStatus,
          verifiedAt: endTime,
        },
      });
    } else {
      await prisma.taskVerifications.create({
        data: {
          taskId: quiz.taskId,
          userId: req.user.id,
          verificationStatus,
          verifiedAt: endTime,
        },
      });
    }

    res.status(200).json({
      message: "Quiz submitted successfully",
      data: {
        score,
        totalQuestions: correctAnswers.length,
        rewardCoins: verificationStatus === "VERIFIED" ? rewardCoins : 0,
        verificationStatus,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    next(error);
  }
};


const showQuiz = async (req, res, next) => {
  try {
    const quizes = await prisma.quizTasks.findMany({
      include: {
        task: true,
      },
    });

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
      data: {
        id: quiz.id,
        taskId: quiz.taskId,
        questions: JSON.parse(quiz.questions),
        correctAnswers: JSON.parse(quiz.correctAnswers),
        timeLimit: quiz.timeLimit,
      },
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
