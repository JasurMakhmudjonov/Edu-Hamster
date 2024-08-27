const { Router } = require("express");

const { isAuth } = require("../middlewares/is-auth.middleware");
const {
  showPurchases,
  showOwnPurchases,
} = require("../controllers/purchases.controller");
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/purchases";

router.get(`${route}/`, isAdmin, showPurchases);
router.get(`${route}/me`, isAuth, showOwnPurchases);

module.exports = router;
