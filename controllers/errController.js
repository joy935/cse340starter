const generateError = (req, res, next) => {
    throw new ReferenceError('An intentional error occurred');
  };
  
exports.generateError = generateError;