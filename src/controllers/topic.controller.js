const prisma = require("../utils/connection");
const topicValidator = require("../validators/topic.validator");

const createTopic = async (req, res, next) => {
  try {
    const { title, description, categoryId } = req.body;
    const { error } = topicValidator.createTopicSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const category = await prisma.topicCategories.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const existsTopic = await prisma.topics.findUnique({ where: { title } });
    if (existsTopic) {
      return res.status(409).json({ message: "Topic already exists" });
    }
    const topic = await prisma.topics.create({
      data: { title, description, categoryId },
    });
    res
      .status(201)
      .json({ message: "Topic created successfully", data: topic });
  } catch (error) {
    next(error);
  }
};

const showTopic = async (req, res, next) => {
  try {
    const {
      categoryId,
      search,
      offset = 1,
      limit = 10,
      sortBy = "title",
      order = "asc",
    } = req.query;

    const skip = (offset - 1) * limit;
    const take = parseInt(limit, 10);

    const validSortFields = ["title", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "title";
    const sortOrder = order === "desc" ? "desc" : "asc";

    const where = {
      ...(categoryId && { categoryId }),
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const topics = await prisma.topics.findMany({
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
        categoryId: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalTopics = await prisma.topics.count({ where });

    if (topics.length > 0) {
      return res.status(200).json({
        message: "All topics found",
        data: topics,
        pagination: {
          total: totalTopics,
          offset: parseInt(offset, 10),
          limit: take,
          totalPages: Math.ceil(totalTopics / take),
        },
      });
    } else {
      return res.status(404).json({
        message: "No topics found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const showTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const topic = await prisma.topics.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        categoryId: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.status(200).json({ message: "Topic found", data: topic });
  } catch (error) {
    next(error);
  }
};

const updateTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId } = req.body;
    const { error } = topicValidator.updateTopicSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    if (categoryId) {
      const category = await prisma.topicCategories.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const exsitsTopic = await prisma.topics.findUnique({ where: { id } });
    if (!exsitsTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    const topic = await prisma.topics.update({
      where: { id },
      data: { title, description, categoryId },
    });

    res
      .status(200)
      .json({ message: "Topic updated successfully", data: topic });
  } catch (error) {
    next(error);
  }
};

const removeTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const topic = await prisma.topics.findUnique({ where: { id } });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    await prisma.topics.delete({ where: { id } });
    res.status(200).json({ message: "Topic deleted successfully" });
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
