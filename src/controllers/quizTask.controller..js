const prisma = require("../utils/connection");
const quizTaskValidator = require("../validators/quizTask.validator");

const createQuiz = async (req, res, next) => {
  try {
    const { taskId, questions, correctAnswers, timeLimit } = req.body;

    const { error } = quizTaskValidator.createQuizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Find the task by its unique id
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
        id: task.id,
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

const updateQuiz = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { taskId, questions, correctAnswers, timeLimit } = req.body;  // Incoming data
  
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
  showQuiz,
  showQuizById,
  updateQuiz,
  removeQuiz,
};
