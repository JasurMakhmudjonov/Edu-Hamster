const { Router } = require("express");
const {
  createSpinReward,
  showSpinReward,
  updateSpinReward,
  removeSpinReward,
  showSpinRewardById,
  addToTotalCoins,
} = require("../controllers/spinReward.controller");
const { isAuth } = require("../middlewares/is-auth.middleware");
const router = Router();

const route = "/spin-rewards";

router.post(`${route}/`, createSpinReward);
router.get(`${route}/`, showSpinReward);
router.get(`${route}/:id`, showSpinRewardById);
router.put(`${route}/:id`, updateSpinReward);
router.delete(`${route}/:id`, removeSpinReward);

router.post(`${route}/add`, isAuth, addToTotalCoins);

module.exports = router;
