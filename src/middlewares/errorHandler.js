/**
 * Global error handling middleware
 * Catches and formats all errors in a consistent way
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] Status: ${status}, Message: ${message}`);
  console.error(err.stack);

  res.status(status).json({
    error: message,
    status: status,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
