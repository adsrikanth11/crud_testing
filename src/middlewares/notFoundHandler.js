/**
 * 404 Not Found middleware
 * Handles requests to undefined routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
    status: 404,
    path: req.path,
    method: req.method,
  });
};

export default notFoundHandler;
