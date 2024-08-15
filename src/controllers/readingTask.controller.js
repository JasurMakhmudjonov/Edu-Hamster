const prisma = require("../utils/connection");
const readingTaskValidator = require("../validators/readingTask.validator");

const createReadingTask = async (req, res, next) => {
  try {
    const { taskId, content, duration } = req.body;
    const { error } = readingTaskValidator.createReadingTaskSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const task = await prisma.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const readingTask = await prisma.readingTasks.create({
      data: {
        taskId,
        content,
        duration,
      },
    });
    res.status(201).json({
      message: "Reading task created successfully",
      data: {
        id: readingTask.id,
        title: task.title,
        description: task.description,
        rewardCoins: task.rewardCoins,
        content: readingTask.content,
        duration: readingTask.duration,
      },
    });
  } catch (error) {
    next(error);
  }
};

const showReadingTask = async (req, res, next) => {
  try {
    const readingTasks = await prisma.readingTasks.findMany({
      include: {
        task: true,
      },
    });

    if (readingTasks.length > 0) {
      res.status(200).json({ message: "Reading tasks ", data: readingTasks });
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
    });
    if (!readingTask) {
      return res.status(404).json({ message: "Reading task not found" });
    }
    res.status(200).json({
      message: "Reading task found",
      data: {
        id: readingTask.id,
        taskId: readingTask.taskId,
        content: readingTask.content,
        duration: readingTask.duration,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateReadingTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { taskId, content, duration } = req.body;
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
    const task = await prisma.tasks.findFirst({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const updateReadingTask = await prisma.readingTasks.update({
      where: { id },
      data: {
        taskId,
        content,
        duration,
      },
    });

    res.status(200).json({
      message: "Reading task updated successfully",
      data: {
        id: updateReadingTask.id,
        taskId: updateReadingTask.taskId,
        content: updateReadingTask.content,
        duration: updateReadingTask.duration,
      },
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

module.exports = {
  createReadingTask,
  showReadingTask,
  showReadingTaskById,
  updateReadingTask,
  removeReadingTask,
};
