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
const router = Router();

const route = "/tasks/";

router.post(`${route}/`, createTFTask);
router.get(`${route}/`, showTFTask);
router.get(`${route}/:id`, showTFTaskById);
router.put(`${route}/:id`, updateTFTask);
router.delete(`${route}/:id`, removeTFTask);

router.post(`${route}/:id/start`, isAuth, startTFTask);
router.post(`${route}/:id/submit`, isAuth, submitTFTask);

module.exports = router;
