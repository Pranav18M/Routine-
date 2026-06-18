/**
 * Sends a standardised success response
 */
function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
}

/**
 * Sends a standardised error response
 */
function sendError(res, message = 'An error occurred', statusCode = 500, errors = null) {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

/**
 * Sends a paginated response
 */
function sendPaginated(res, data, total, page, limit, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  });
}

module.exports = { sendSuccess, sendError, sendPaginated };