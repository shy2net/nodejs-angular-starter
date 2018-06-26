export function sendOk(res, data?: any) {
  res.json({
    status: 'ok',
    error: null,
    data: data
  });
}

export function sendError(res, status?, error?) {
  // Log the error
  error && console.error(error);

  res.status(status || 400).json({
    status: 'error',
    error: error
  });
}
