const { Router } = require("express");
const { leaderboard } = require("../controllers/leaderBoard.controller");

const router = Router();

router.get("/leaderboard", leaderboard);

module.exports = router;
