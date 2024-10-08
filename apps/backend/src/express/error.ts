/* eslint-disable */
import { ErrorRequestHandler } from "express";

export const expressGloalErrorHandler: ErrorRequestHandler = (err: Error, _req, res, _next) => {
  console.error(err.stack);

  // @ts-expect-error TODO
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode,
    },
  });
};
