const { Router } = require("express");

const {
  createTopic,
  showTopic,
  showTopicById,
  updateTopic,
  removeTopic,
} = require("../controllers/topic.controller");
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/topics";

router.post(`${route}/`, isAdmin, createTopic);
router.get(`${route}/`, showTopic);
router.get(`${route}/:id`, showTopicById);
router.put(`${route}/:id`, isAdmin, updateTopic);
router.delete(`${route}/:id`, isAdmin, removeTopic);

module.exports = router;
