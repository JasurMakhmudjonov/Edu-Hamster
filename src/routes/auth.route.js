const { Router } = require("express");
const {
  register,
  verify,
  login,
  adminLogin,
} = require("../controllers/auth.controller");
const router = Router();

const route = "/auth";

router.post(`${route}/register`, register);
router.post(`${route}/verify`, verify);
router.post(`${route}/login`, login);
router.post(`/admin/login`, adminLogin);


module.exports = router;
