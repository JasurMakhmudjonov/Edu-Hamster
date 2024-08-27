const { Router } = require("express");

const {
  createEIC,
  showEIC,
  sowEICById,
  updateEIC,
  removeEIC,
} = require("../controllers/exchangeItemsCategories.controller");
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/exchange-items-categories";

router.post(`${route}/`, isAdmin, createEIC);
router.get(`${route}/`, showEIC);
router.get(`${route}/:id`, sowEICById);
router.put(`${route}/:id`, isAdmin, updateEIC);
router.delete(`${route}/:id`, isAdmin, removeEIC);

module.exports = router;
