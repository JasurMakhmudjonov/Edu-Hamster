const prisma = require("../utils/connection");
const videoTaskValidator = require("../validators/videoTask.validator");
const { calculateAndApplyRewards } = require("../utils/leveling");

const createVideoTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      videoUrl,
      videoDuration,
      rewardCoins,
      topicId,
    } = req.body;

    const { error } = videoTaskValidator.createVideoTaskSchema.validate(
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

    const videoTask = await prisma.videoTasks.create({
      data: {
        title,
        description,
        videoUrl,
        videoDuration,
        rewardCoins,
        topicId,
      },
    });

    res.status(201).json({
      message: "Video task created successfully",
      data: videoTask,
    });
  } catch (error) {
    next(error);
  }
};

const showVideoTask = async (req, res, next) => {
  try {
    const videoTasks = await prisma.videoTasks.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        videoDuration: true,
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

    res.status(200).json({ message: "Video tasks found", data: videoTasks });
  } catch (error) {
    next(error);
  }
};

const showVideoTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videoTask = await prisma.videoTasks.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        videoDuration: true,
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

    if (!videoTask) {
      return res.status(404).json({ message: "Video task not found" });
    }

    res.status(200).json({
      message: "Video task found",
      data: videoTask,
    });
  } catch (error) {
    next(error);
  }
};

const updateVideoTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      videoUrl,
      videoDuration,
      rewardCoins,
      topicId,
    } = req.body;

    const { error } = videoTaskValidator.updateVideoTaskSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const videoTask = await prisma.videoTasks.findUnique({
      where: { id },
    });

    if (!videoTask) {
      return res.status(404).json({ message: "Video task not found" });
    }

    if (topicId) {
      const topic = await prisma.topics.findUnique({
        where: { id: topicId },
      });

      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
    }

    const updatedVideoTask = await prisma.videoTasks.update({
      where: { id },
      data: {
        title,
        description,
        videoUrl,
        videoDuration,
        rewardCoins,
        topicId,
      },
    });

    res.status(200).json({
      message: "Video task updated successfully",
      data: updatedVideoTask,
    });
  } catch (error) {
    next(error);
  }
};

const removeVideoTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videoTask = await prisma.videoTasks.findUnique({ where: { id } });
    if (!videoTask) {
      return res.status(404).json({ message: "Video task not found" });
    }
    await prisma.videoTasks.delete({ where: { id } });
    res.status(200).json({ message: "Video task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const startVideoTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const videoTask = await prisma.videoTasks.findUnique({
      where: { id },
    });

    if (!videoTask) {
      return res.status(404).json({ message: "Video task not found" });
    }

    const userTask = await prisma.userVideoTasks.findFirst({
      where: { userId, videoTaskId: videoTask.id },
    });

    if (userTask) {
      if (
        userTask.videoStatus === "ACCEPTED" ||
        userTask.videoStatus === "FAILED"
      ) {
        return res.status(200).json({
          message:
            "Video task retake started. No additional reward coins will be awarded.",
          data: videoTask,
        });
      }
    } else {
      await prisma.userVideoTasks.create({
        data: {
          userId,
          videoTaskId: videoTask.id,
          videoStatus: "PENDING",
          videoStartTime: new Date(),
        },
      });
    }

    res.status(200).json({
      message: "Video task started",
      data: videoTask,
    });
  } catch (error) {
    next(error);
  }
};

const submitVideoTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const videoTask = await prisma.videoTasks.findUnique({
      where: { id },
    });

    if (!videoTask) {
      return res.status(404).json({ message: "Video task not found" });
    }

    const userVideoTask = await prisma.userVideoTasks.findFirst({
      where: {
        userId: userId,
        videoTaskId: videoTask.id,
      },
    });

    if (!userVideoTask) {
      return res.status(404).json({ message: "User task not found" });
    }

    const endTime = new Date();
    const timeTaken =
      (endTime - new Date(userVideoTask.videoStartTime)) / 60000;

    const allowedTime = videoTask.videoDuration / 2;

    let videoStatus = "FAILED";
    let rewardCoins = 0;
    let points = 0;
    let newLevel = userVideoTask.level;

    if (timeTaken >= allowedTime) {
      videoStatus = "ACCEPTED";
      const rewards = await calculateAndApplyRewards(
        userId,
        videoTask.rewardCoins,
        videoTask.rewardCoins
      );
      rewardCoins = rewards.actualCoins;
      points = rewards.actualPoints;
      newLevel = rewards.newLevel;
    }

    await prisma.userVideoTasks.update({
      where: { id: userVideoTask.id },
      data: {
        videoStatus,
        videoStartTime: endTime, // Consider changing this to `videoEndTime` or similar to better represent what this field is for
      },
    });

    res.status(200).json({
      message: "Video task submitted successfully",
      data: {
        rewardCoins: rewardCoins,
        points: points,
        newLevel: newLevel,
        videoStatus: videoStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createVideoTask,
  showVideoTask,
  showVideoTaskById,
  updateVideoTask,
  removeVideoTask,
  startVideoTask,
  submitVideoTask,
};
