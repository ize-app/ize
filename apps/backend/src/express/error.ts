import { ErrorRequestHandler } from "express";

export const expressGloalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode,
    },
  });
};
