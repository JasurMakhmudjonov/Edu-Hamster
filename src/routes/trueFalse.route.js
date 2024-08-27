const { Router } = require("express");
const {
  createTFTask,
  showTFTask,
  updateTFTask,
  removeTFTask,
  showTFTaskById,
  startReadingTask,
  submitReadingTask,
  startTFTask,
  submitTFTask,
} = require("../controllers/trueFalseTask.controller");
const { isAuth } = require("../middlewares/is-auth.middleware");
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/topics/true-false-task";

router.post(`${route}/`, isAdmin, createTFTask);
router.get(`${route}/`, showTFTask);
router.get(`${route}/:id`, showTFTaskById);
router.put(`${route}/:id`, isAdmin, updateTFTask);
router.delete(`${route}/:id`, isAdmin, removeTFTask);

router.post(`${route}/:id/start`, isAuth, startTFTask);
router.post(`${route}/:id/submit`, isAuth, submitTFTask);

module.exports = router;
