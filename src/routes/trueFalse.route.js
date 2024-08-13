const { Router } = require("express");
const {
  createTFTask,
  showTFTask,
  updateTFTask,
  removeTFTask,
  showTFTaskById,
} = require("../controllers/trueFalseTask.controller");
const router = Router();

const route = "/tasks/";

router.post(`${route}/`, createTFTask);
router.get(`${route}/`, showTFTask);
router.get(`${route}/:id`, showTFTaskById);
router.put(`${route}/:id`, updateTFTask);
router.delete(`${route}/:id`, removeTFTask);

module.exports = router;
