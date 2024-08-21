const { Router } = require("express");
const {
  createVideoTask,
  showVideoTask,
  updateVideoTask,
  removeVideoTask,
  showVideoTaskById,
  startVideoTask,
  submitVideoTask
} = require("../controllers/videoTask.controller");
const { isAuth } = require("../middlewares/is-auth.middleware");
const router = Router();

const route = "/topics/video-tasks";

router.post(`${route}/`, createVideoTask);
router.get(`${route}/`, showVideoTask);
router.get(`${route}/:id`, showVideoTaskById);
router.put(`${route}/:id`, updateVideoTask);
router.delete(`${route}/:id`, removeVideoTask);

router.post(`${route}/:id/start`, isAuth, startVideoTask);
router.post(`${route}/:id/submit`, isAuth, submitVideoTask);

module.exports = router;
