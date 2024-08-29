const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

const getTodayRange = () => ({
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
});

const getThisWeekRange = () => ({
  start: startOfWeek(new Date(), { weekStartsOn: 1 }), // Assuming the week starts on Monday
  end: endOfWeek(new Date(), { weekStartsOn: 1 }),
});

const getThisMonthRange = () => ({
  start: startOfMonth(new Date()),
  end: endOfMonth(new Date()),
});

module.exports = {
  getTodayRange,
  getThisWeekRange,
  getThisMonthRange,
};
