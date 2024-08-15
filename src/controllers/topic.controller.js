const prisma = require("../utils/connection");
const taskValidator = require("../validators/task.validator");

const createTopic = async (req, res, next) => {
  try {
    const { title, description, rewardCoins } = req.body;

    // Validate the request body using Joi
    const { error } = taskValidator.createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Check if a task with the same title already exists
    const existsTask = await prisma.tasks.findUnique({ where: { title } });
    if (existsTask) {
      return res.status(400).json({ message: "Task already exists" });
    }

    // Create the new task
    const task = await prisma.tasks.create({
      data: { title, description, rewardCoins },
    });

    res.status(201).json({ message: "Task created successfully", data: task });
  } catch (error) {
    next(error);
  }
};

const showTopic = async (req, res, next) => {
  try {
    const allTasks = await prisma.tasks.findMany();

    if (allTasks.length > 0) {
      res.status(200).json({ message: "All tasks", data: allTasks });
    } else {
      res.status(404).json({ message: "No tasks found" });
    }
  } catch (error) {
    next(error);
  }
};

const showTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.tasks.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task found", data: task });
  } catch (error) {
    next(error);
  }
};

const updateTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, rewardCoins } = req.body;

    const { error } = taskValidator.updateTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const existsTask = await prisma.tasks.findUnique({ where: { id } });
    if (!existsTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.tasks.update({
      where: { id },
      data: { title, description, rewardCoins },
    });

    res
      .status(200)
      .json({ message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    next(error);
  }
};

const removeTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.tasks.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.tasks.delete({ where: { id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTopic,
  showTopic,
  showTopicById,
  updateTopic,
  removeTopic,
};
