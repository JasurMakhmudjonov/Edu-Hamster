const { Router } = require("express");
const {
  createExchangeItem,
  showExchangeItems,
  showExchangeItemById,
  updateExchangeItem,
  removeExchangeItem,
  purchaseItem,
} = require("../controllers/exchangeItems.controller");
const { isAuth } = require("../middlewares/is-auth.middleware");
const { isAdmin } = require("../middlewares/is-admin.middleware");

const router = Router();

const route = "/exchange-items";

router.post(`${route}/`, isAdmin, createExchangeItem);
router.get(`${route}/`, showExchangeItems);
router.get(`${route}/:id`, showExchangeItemById);
router.put(`${route}/:id`, isAdmin, updateExchangeItem);
router.delete(`${route}/:id`, isAdmin, removeExchangeItem);

router.post(`${route}/:itemId/purchase`, isAuth, purchaseItem);

module.exports = router;
