const {Router} = require("express");
const { createTopicCategory, showTopicCategories, showTopicCategoryById, updateTopicCategory, removeTopicCategory } = require("../controllers/topicCategory.controller");
const router = Router();

const route = "/topic-categories"


router.post(`${route}/`, createTopicCategory)
router.get(`${route}/`, showTopicCategories)
router.get(`${route}/`, showTopicCategoryById)
router.put(`${route}/`, updateTopicCategory)
router.delete(`${route}/`, removeTopicCategory)

module.exports = router;
