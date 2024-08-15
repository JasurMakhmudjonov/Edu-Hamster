const { Router } = require("express");
const {
  createSpinTask,
  showSpinTask,
  updateSpinTask,
  removeSpinTask,
  showSpinTaskById,
} = require("../controllers/spinReward.controller");
const router = Router();

const route = "/tasks/spin";

router.post(`${route}/`, createSpinTask);
router.get(`${route}/`, showSpinTask);
router.get(`${route}/:id`, showSpinTaskById);
router.put(`${route}/:id`, updateSpinTask);
router.delete(`${route}/:id`, removeSpinTask);

module.exports = router;
