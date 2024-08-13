const { Router } = require("express");

const {
  createTask,
  showTask,
  showTaskById,
  updateTask,
  removeTask,
} = require("../controllers/task.controller");
const router = Router();

const route = "/tasks";

router.post(`${route}/`, createTask);
router.get(`${route}/`, showTask);
router.get(`${route}/:id`, showTaskById);
router.put(`${route}/:id`, updateTask);
router.delete(`${route}/:id`, removeTask);

module.exports = router;
