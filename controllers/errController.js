const generateError = (req, res, next) => {
    throw new Error('An intentional error occurred');
  };
  
  exports.generateError = generateError;