const { Router } = require("express");

const {
  createTopic,
  showTopic,
  showTopicById,
  updateTopic,
  removeTopic,
} = require("../controllers/topic.controller");
const router = Router();

const route = "/topics";

router.post(`${route}/`, createTopic);
router.get(`${route}/`, showTopic);
router.get(`${route}/:id`, showTopicById);
router.put(`${route}/:id`, updateTopic);
router.delete(`${route}/:id`, removeTopic);

module.exports = router;
