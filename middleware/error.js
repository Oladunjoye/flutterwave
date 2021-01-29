// const ErrorResponse = require('../utils/errorResponse');

const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  // console.log(err);

  if (error.message === 'invalid json') {
    const message = `Payload not JSON `;
    error = new ErrorResponse(message, 404);
  }

    
  res.status(error.statusCode || 500).json({
    message: error.message || 'Server Error',
    status:"error",
    data: null
  });
};

module.exports = errorHandler;
