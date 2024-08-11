const { Router } = require("express");
const { register, verify, login } = require("../controllers/auth.controller");
const router = Router();

const route = "/auth";

router.post(`${route}/register`, register);
router.post(`${route}/verify`, verify);
router.post(`${route}/login`, login);
router.post(`/admin/login`);

module.exports = router;
