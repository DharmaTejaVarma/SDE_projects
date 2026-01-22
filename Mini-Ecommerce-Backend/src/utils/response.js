const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

const sendSuccess = (res, message, data = null, meta = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data, meta);
};

const sendError = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};