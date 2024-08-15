const createTopicCategory = async (req, res, next) => {
  try {
    const {name} = req.body;
    
  } catch (error) {
    next(error);
  }
};


const showTopicCategories = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };
  

  const showTopicCategoryById = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };
  

  const updateTopicCategory = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };


  const removeTopicCategory = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  module.exports = {
    createTopicCategory,
    showTopicCategories,
    showTopicCategoryById,
    updateTopicCategory,
    removeTopicCategory
  };

