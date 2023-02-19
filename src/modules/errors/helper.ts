import { RequestHandler } from "express";
import AppError from "./app-error";

// mongoose validation ________________________________________________________________________________
/**
 * when there is an invalid path and value in mongoose
 * @param err AppError
 * @returns new AppError but with better message
 */
const getCastError = (err: AppError) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

/**
 * gets data from long mongoose error message
 * @param str string
 * @returns the path which was duplicated
 */
const getDuplicateValue = (str: string) => {
  const value = str.match(/(["'])(\\?.)*?\1/);
  if (value) return value[0];
};

/**
 * for fixing mongoose duplicate key error message
 * @param err AppError
 * @returns new AppError with better err message
 */
const getDuplicateKeyError = (err: AppError) =>
  new AppError(
    `duplicate key value: ${getDuplicateValue(
      err.errmsg
    )} , please use another value`
  );

// JWT errors ________________________________________________________________________________

/**
 * for jwt errors
 * @returns AppError for jwt errors
 */
const getJwtError = () =>
  new AppError("invalid token please log in again", 401);

/**
 * for jwt errors
 * @returns AppError for jwt errors
 */
const getTokenExpiredError = () =>
  new AppError("token has expired please log in again", 401);

// fix error object ________________________________________________________________________________
/**
 * handling error with less detail
 * @param err AppError
 * @returns new AppError with less detail for production
 */
const getProductionError = function (err: AppError) {
  let productionError: AppError = { ...err, message: err.message };

  if (err.name === "CastError") productionError = getCastError(err);
  if (err.code === 11000) productionError = getDuplicateKeyError(err);
  if (err.name === "JsonWebTokenError") productionError = getJwtError();
  if (err.name === "TokenExpiredError")
    productionError = getTokenExpiredError();

  return productionError;
};

// rejection errors ________________________________________________________________________________
/**
 * in case of Promise rejections, this function will handle them
 * @param fn async RequestHandler functions
 *  */
const escortAsync = function <T extends Function>(fn: T): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch((err: any) =>
      next(new AppError(err.message, 400, err))
    );
  };
};

export { escortAsync, getProductionError };
