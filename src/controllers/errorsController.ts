import { ErrorRequestHandler } from "express";
import AppError, { getProductionError } from "../modules/errors";

type ResType = Parameters<ErrorRequestHandler>[2];

// handle bugs
const sendProgrammaticalError = (res: ResType) =>
  res.status(500).json({
    status: "error",
    message: "something went very wrong 🥴",
  });

// handle in development mode
const sendDevError = (res: ResType, err: AppError) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    completeError: err,
  });

// handle in production mode
const sendProductionError = (res: ResType, err: AppError) => {
  let productionError: AppError = getProductionError(err);

  return res.status(productionError.statusCode).json({
    status: productionError.status,
    message: productionError.message,
    data: null,
  });
};

const globalErrorHandler: ErrorRequestHandler = function (
  err: AppError,
  req,
  res,
  next
) {
  if (!err.isOperational) sendProgrammaticalError(res);

  if (process.env.NODE_ENV === "development") sendDevError(res, err);
  else if (process.env.NODE_ENV === "production") sendProductionError(res, err);
};

export default globalErrorHandler;
