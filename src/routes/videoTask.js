const { Router } = require("express");
const {
  createVideoTask,
  showVideoTask,
  updateVideoTask,
  removeVideoTask,
  showVideoTaskById,
} = require("../controllers/videoTask.controller");
const router = Router();

const route = "/tasks/videos";

router.post(`${route}/`, createVideoTask);
router.get(`${route}/`, showVideoTask);
router.get(`${route}/:id`, showVideoTaskById);
router.put(`${route}/:id`, updateVideoTask);
router.delete(`${route}/:id`, removeVideoTask);

module.exports = router;
