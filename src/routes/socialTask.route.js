const { Router } = require("express");
const {
  createSocilaShare,
  showSocilaShare,
  updateSocilaShare,
  removeSocilaShare,
  showSocilaShareById,
} = require("../controllers/socialTask.controller");
const router = Router();

const route = "/tasks/social-sharing";

router.post(`${route}/`, createSocilaShare);
router.get(`${route}/`, showSocilaShare);
router.get(`${route}/:id`, showSocilaShareById);
router.put(`${route}/:id`, updateSocilaShare);
router.delete(`${route}/:id`, removeSocilaShare);

module.exports = router;
