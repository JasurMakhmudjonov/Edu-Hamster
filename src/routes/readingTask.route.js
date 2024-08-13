const { Router } = require("express");
const {
  createReadingTask,
  showReadingTask,
  updateReadingTask,
  removeReadingTask,
  showReadingTaskById,
} = require("../controllers/readingTask.controller");
const router = Router();

const route = "/tasks/reading";

router.post(`${route}/`, createReadingTask);
router.get(`${route}/`, showReadingTask);
router.get(`${route}/:id`, showReadingTaskById);
router.put(`${route}/:id`, updateReadingTask);
router.delete(`${route}/:id`, removeReadingTask);

module.exports = router;
