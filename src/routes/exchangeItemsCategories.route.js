const { Router } = require("express");

const {
  createEIC,
  showEIC,
  sowEICById,
  updateEIC,
  removeEIC,
} = require("../controllers/exchangeItemsCategories.controller");
const router = Router();

const route = "/exchange-items-categories";

router.post(`${route}/`, createEIC);
router.get(`${route}/`, showEIC);
router.get(`${route}/:id`, sowEICById);
router.put(`${route}/:id`, updateEIC);
router.delete(`${route}/:id`, removeEIC);

module.exports = router;
