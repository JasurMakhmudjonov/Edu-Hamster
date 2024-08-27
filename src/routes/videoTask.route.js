const { Router } = require("express");
const {
  createVideoTask,
  showVideoTask,
  updateVideoTask,
  removeVideoTask,
  showVideoTaskById,
  startVideoTask,
  submitVideoTask,
} = require("../controllers/videoTask.controller");
const { isAuth } = require("../middlewares/is-auth.middleware");
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/topics/video-tasks";

router.post(`${route}/`, isAdmin, createVideoTask);
router.get(`${route}/`, showVideoTask);
router.get(`${route}/:id`, showVideoTaskById);
router.put(`${route}/:id`, isAdmin, updateVideoTask);
router.delete(`${route}/:id`, isAdmin, removeVideoTask);

router.post(`${route}/:id/start`, isAuth, startVideoTask);
router.post(`${route}/:id/submit`, isAuth, submitVideoTask);

module.exports = router;
