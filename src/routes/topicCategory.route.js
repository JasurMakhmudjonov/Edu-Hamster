const { Router } = require("express");
const {
  createTopicCategory,
  showTopicCategories,
  showTopicCategoryById,
  updateTopicCategory,
  removeTopicCategory,
} = require("../controllers/topicCategory.controller");
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/topic-categories";

router.post(`${route}/`, isAdmin, createTopicCategory);
router.get(`${route}/`, showTopicCategories);
router.get(`${route}/:id`, showTopicCategoryById);
router.put(`${route}/:id`, isAdmin, updateTopicCategory);
router.delete(`${route}/:id`, isAdmin, removeTopicCategory);

module.exports = router;
