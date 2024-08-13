const { Router } = require("express");
const {
  createUserTask,
  showUserTasks,
  updateUserTask,
  removeUserTask,
  showUserTaskById,
} = require("../controllers/userTask.controller");
const router = Router();

const route = "/tasks/user";

router.post(`${route}/`, createUserTask);
router.get(`${route}/`, showUserTasks);
router.get(`${route}/:id`, showUserTaskById);
router.put(`${route}/:id`, updateUserTask);
router.delete(`${route}/:id`, removeUserTask);

module.exports = router;
