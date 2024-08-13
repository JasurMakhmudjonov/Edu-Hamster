const createTest = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };
  
  const showTest = async (req, res, next) => {
      try {
      } catch (error) {
        next(error);
      }
    };

    const showTestById= async (req, res, next) => {
        try {
        } catch (error) {
          next(error);
        }
      };
  
  
    const updateTest = async (req, res, next) => {
      try {
      } catch (error) {
        next(error);
      }
    };
  
  
    const removeTest = async (req, res, next) => {
      try {
      } catch (error) {
        next(error);
      }
    };
  
    module.exports = {
        createTest,
        showTest,
        showTestById,
        updateTest,
        removeTest,
    };
  