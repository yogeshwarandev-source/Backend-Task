const httpStatus = require('http-status');
const ApiError = require('./ApiError.js');


function notFoundHandler(req, res, next){
  throw new ApiError(
    httpStatus.NOT_FOUND,
    `Requested api not found: ${req.method} ${req.originalUrl}`
  );
}

function sendError(req, res, error) {
    return res.status(error.status || 500).json({
      type: 'error',
      message: error.message || 'Unhandled Error',
      error
    })
  }

  function   sendSuccess(req, res, message, status) {
    return async (data) => {
        status = 200
      res.status(status).json({
        type: 'success',
        message: message || 'Success result',
        data     
       })
    }
  }

module.exports = {notFoundHandler, sendError,sendSuccess }