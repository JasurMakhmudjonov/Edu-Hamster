const { Router } = require("express");
const {
  createReferral,
  showReferral,
  updateReferral,
  removeReferral,
  showReferralById,
} = require("../controllers/referrealTask.controller");
const router = Router();

const route = "/tasks/referrals";

router.post(`${route}/`, createReferral);
router.get(`${route}/`, showReferral);
router.get(`${route}/:id`, showReferralById);
router.put(`${route}/:id`, updateReferral);
router.delete(`${route}/:id`, removeReferral);

module.exports = router;
