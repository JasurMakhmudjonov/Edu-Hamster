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
const router = Router();

const route = "/topics/quizes";

router.post(`${route}/`, createQuiz);
router.get(`${route}/`, showQuiz);
router.get(`${route}/:id`, showQuizById);
router.put(`${route}/:id`, updateQuiz);
router.delete(`${route}/:id`, removeQuiz);

router.post(`${route}/:id/start`, isAuth, startQuiz);
router.post(`${route}/:id/submit`, isAuth, submitQuiz);

module.exports = router;
