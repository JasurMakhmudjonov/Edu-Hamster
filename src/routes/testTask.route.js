const { Router } = require("express");
const {
  createTest,
  updateTest,
  showTest,
  removeTest,
  showTestById,
} = require("../controllers/testTask.controller");
const router = Router();

const route = "/tasks/tests";

router.post(`${route}/`, createTest);
router.get(`${route}/`, showTest);
router.get(`${route}/:id`, showTestById);
router.put(`${route}/:id`, updateTest);
router.delete(`${route}/:id`, removeTest);

module.exports = router;
