const errorMiddleware = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err);
  
    // Render the error view
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'An intentional error occurred.'
    });
  };
  
module.exports = errorMiddleware;