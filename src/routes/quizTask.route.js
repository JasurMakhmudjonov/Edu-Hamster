const { Router } = require("express");
const {
  createQuiz,
  showQuiz,
  updateQuiz,
  removeQuiz,
  showQuizById,
  startQuiz,
  submitQuiz,
} = require("../controllers/quizTask.controller.");
const { isAuth } = require("../middlewares/is-auth.middleware");
const { isAdmin } = require("../middlewares/is-admin.middleware");
const router = Router();

const route = "/topics/quizzes";

router.post(`${route}/`, isAdmin, createQuiz);
router.get(`${route}/`, showQuiz);
router.get(`${route}/:id`, showQuizById);
router.put(`${route}/:id`, isAdmin, updateQuiz);
router.delete(`${route}/:id`, isAdmin, removeQuiz);

router.post(`${route}/:id/start`, isAuth, startQuiz);
router.post(`${route}/:id/submit`, isAuth, submitQuiz);

module.exports = router;
