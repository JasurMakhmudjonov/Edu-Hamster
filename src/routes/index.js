const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const quizTaskRoute = require("./quizTask.route");
const readingTaskRoute = require("./readingTask.route");
const referralTaskRoute = require("./referralTask.route");
const socialTaskRoute = require("./socialTask.route");
const spinTaskRoute = require("./spinTask.route");
const testTaskRoute = require("./testTask.route");
const trueFalseRoute = require("./trueFalse.route");
const userTasksRoute = require("./userTasks.route");
const videoTaskRoute = require("./videoTask.route");
const taskRoute = require("./task.route");

module.exports = [
  authRoute,
  userRoute,
  quizTaskRoute,
  readingTaskRoute,
  referralTaskRoute,
  socialTaskRoute,
  spinTaskRoute,
  testTaskRoute,
  trueFalseRoute,
  userTasksRoute,
  videoTaskRoute,
  taskRoute,
];
