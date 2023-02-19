import AppError from "../errors/app-error";
import { User } from "./../../types/users-types";
import crypto from "crypto";
import { getSuccessJsend } from "../general";

import type { CookieOptions, NextFunction, Request, Response } from "express";
/**
 * ges secret key from env variables
 * @param next NextFunction
 * @returns string token
 */
const getSecretKey = (next?: NextFunction) => {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  const errMessage = "please define secret key";
  if (next) return next(new Error(errMessage));
  throw new Error(errMessage);
};

/**
 * gets authentication bearer token
 * @param headers req.header
 * @param next NextFunction
 * @returns Token
 */
const getTokenFromHeader = (
  headers: Request["headers"],
  next: NextFunction
) => {
  const authorizationHeader = headers.authorization;
  let token: string | undefined;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer"))
    token = authorizationHeader.split(" ")[1];

  if (!token) return next(new AppError("not logged in", 401));
  return token;
};

/**
 * sending jwt by cookie
 * @param res
 * @param token
 * @param user User
 */
const sendToken = (res: Response, token: string, user?: User) => {
  const expiresIn = new Date(
    Date.now() +
      Number(process.env.JWT_COOKIE_EXPIRES_IN as string) * 24 * 60 * 60 * 1000
  );

  const cookieOptions: CookieOptions = {
    expires: expiresIn,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res
    .cookie("jwt", token, cookieOptions)
    .status(200)
    .json(getSuccessJsend(user ? { user } : null));
};

/**
 * creates reset password url
 * @param req
 * @param token
 * @returns url
 */
const createResetPasswordUrl = (req: Request, token: string) =>
  `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${token}`;

/**
 * message to be sent to email
 * @param args [req, token]
 * @returns string email text
 */
const getResetPasswordMessage = (
  ...args: Parameters<typeof createResetPasswordUrl>
) =>
  `submit a PATCH request to : ${createResetPasswordUrl(
    ...args
  )} \n ignore this email if you don't have forgot your password`;

/**
 *
 * @returns random token
 */
const getPasswordResetToken = () => crypto.randomBytes(32).toString("hex");

/**
 * for encrypting reset password token
 * @param token {string}
 * @returns hashed string hex
 */
const hashPasswordResetToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export {
  getTokenFromHeader,
  getResetPasswordMessage,
  getSecretKey,
  sendToken,
  hashPasswordResetToken,
  getPasswordResetToken,
};
