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
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/spin-rewards";

router.post(`${route}/`, isAdmin, createSpinReward);
router.get(`${route}/`, showSpinReward);
router.get(`${route}/:id`, showSpinRewardById);
router.put(`${route}/:id`, isAdmin, updateSpinReward);
router.delete(`${route}/:id`, isAdmin, removeSpinReward);

router.post(`${route}/add`, isAuth, addToTotalCoins);

module.exports = router;
