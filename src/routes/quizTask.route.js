const { Router } = require("express");
const {
  createQuiz,
  showQuiz,
  updateQuiz,
  removeQuiz,
  showQuizById,
} = require("../controllers/quizTask.controller.");
const router = Router();

const route = "/tasks/quizes";

router.post(`${route}/`, createQuiz);
router.get(`${route}/`, showQuiz);
router.get(`${route}/:id`, showQuizById);
router.put(`${route}/:id`, updateQuiz);
router.delete(`${route}/:id`, removeQuiz);

module.exports = router;
