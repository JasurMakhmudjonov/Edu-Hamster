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
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/topics/reading-tasks";

router.post(`${route}/`, isAdmin, createReadingTask);
router.get(`${route}/`, showReadingTask);
router.get(`${route}/:id`, showReadingTaskById);
router.put(`${route}/:id`, isAdmin, updateReadingTask);
router.delete(`${route}/:id`, isAdmin, removeReadingTask);

router.post(`${route}/:id/start`, isAuth, startReadingTask);
router.post(`${route}/:id/submit`, isAuth, submitReadingTask);

module.exports = router;
