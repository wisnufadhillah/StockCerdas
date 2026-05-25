function notFoundHandler(req, res) {
  res.status(404).json({
    status: "fail",
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: error.message || "Terjadi kesalahan pada server",
  });
}

module.exports = { notFoundHandler, errorHandler };
