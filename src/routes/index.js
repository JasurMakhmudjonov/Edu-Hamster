const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const quizTaskRoute = require("./quizTask.route");
const readingTaskRoute = require("./readingTask.route");
const spinRewardRoute = require("./spinReward.route");
const trueFalseRoute = require("./trueFalse.route");
const videoTaskRoute = require("./videoTask.route");
const topicRoute = require("./topic.route");
const topicCategoryRoute = require("./topicCategory.route");
const EICRoute = require("./exchangeItemsCategories.route");
const exchangeItemsRoute = require("./exchangeItems.route");
const purchaseRoute = require("./purchases.route");
const leaderBoardRoute = require("./leaderBoart.route");

module.exports = [
  authRoute,
  userRoute,
  quizTaskRoute,
  readingTaskRoute,
  spinRewardRoute,
  trueFalseRoute,
  videoTaskRoute,
  topicRoute,
  topicCategoryRoute,
  EICRoute,
  exchangeItemsRoute,
  purchaseRoute,
  leaderBoardRoute,
];
