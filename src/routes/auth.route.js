const { Router } = require("express");
const router = Router();

const route = "/auth";

router.post(`${route}/register`);
router.post(`${route}/verify`);
router.post(`${route}/login`);
router.post(`/admin/login`);

module.exports = router;
