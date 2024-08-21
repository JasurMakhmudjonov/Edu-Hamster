const { Router } = require("express");
const {
  createReadingTask,
  showReadingTask,
  updateReadingTask,
  removeReadingTask,
  showReadingTaskById,
  startReadingTask,
  submitReadingTask,
} = require("../controllers/readingTask.controller");
const { isAuth } = require("../middlewares/is-auth.middleware");
const router = Router();

const route = "/topics/reading-tasks";

router.post(`${route}/`, createReadingTask);
router.get(`${route}/`, showReadingTask);
router.get(`${route}/:id`, showReadingTaskById);
router.put(`${route}/:id`, updateReadingTask);
router.delete(`${route}/:id`, removeReadingTask);

router.post(`${route}/:id/start`, isAuth, startReadingTask);
router.post(`${route}/:id/submit`, isAuth, submitReadingTask);

module.exports = router;
