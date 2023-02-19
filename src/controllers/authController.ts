import User from "../models/user";
import AppError from "../modules/errors/app-error";
import jwt from "jsonwebtoken";
import sendMail from "../modules/auth/email";
import crypto from "crypto";
import { escortAsync } from "../modules/errors";
import { getSuccessJsend } from "../modules/general";
import {
  getTokenFromHeader,
  getResetPasswordMessage,
  getSecretKey,
  sendToken,
  hashPasswordResetToken,
} from "../modules/auth";

import type {
  SignUpData,
  LoginData,
  UserRoles,
  updatePasswordData,
} from "../types";
import type { RequestHandler } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { filterUserUpdateFields } from "../modules/users";

const signToken = (id: string, secret: string) =>
  jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// ________________________________________________________________________________

const signup = escortAsync<RequestHandler<any, any, SignUpData>>(
  async function (req, res, next) {
    const userData = filterUserUpdateFields(
      req.body,
      "name",
      "email",
      "photo",
      "confirmPassword",
      "password"
    );
    const newUser = await User.create(userData);

    const secretKey = getSecretKey(next) as string;
    const token = signToken(newUser._id, secretKey);

    newUser.set("password", undefined);
    sendToken(res, token, newUser);
  }
);

// ________________________________________________________________________________

const login = escortAsync<RequestHandler<any, any, LoginData>>(async function (
  req,
  res,
  next
) {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("please provide an email and password", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new AppError("incorrect email or password", 401));

  const isPassCorrect = await user.validatePassword(password, user.password);
  if (!isPassCorrect)
    return next(new AppError("incorrect email or password", 401));

  const secretKey = getSecretKey(next) as string;

  const token = signToken(user._id, secretKey);

  user.set("password", undefined);
  sendToken(res, token, user);
});

// ________________________________________________________________________________

const protect = escortAsync<RequestHandler>(async function (req, res, next) {
  const token = getTokenFromHeader(req.headers, next);

  const secretKey = getSecretKey(next) as string;

  const decodedData = jwt.verify(token as string, secretKey) as JwtPayload & {
    id: string;
  };

  const user = await User.findById(decodedData.id);
  if (!user) return next(new AppError("user dose not exists", 401));

  if (user.validateTokenAndChangedPassword(decodedData.iat))
    return next(new AppError("user recently changed password", 401));

  (req as any).user = user;
  next();
});

// ________________________________________________________________________________

const restrictTo = function (...roles: UserRoles[]): RequestHandler {
  type ReqType = Parameters<RequestHandler>[0] & { user: { role: string } };
  return function (req, res, next) {
    if (!roles.includes((req as ReqType).user.role as UserRoles))
      return next(
        new AppError("you don't have permission to perform this action", 403)
      );

    next();
  };
};

// ________________________________________________________________________________

const forgotPassword = escortAsync<RequestHandler<any, any, { email: string }>>(
  async function (req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(
        new AppError("there is no user with this email address", 404)
      );

    const token = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendMail({
        text: getResetPasswordMessage(req, token),
        to: user.email,
        subject: "password reset token (valid for 10min)",
      });

      res
        .status(200)
        .json(
          getSuccessJsend({ message: "reset password token sent to email" })
        );
    } catch (error) {
      user.passwordResetToken = user.passwordResetExpires = undefined;
      user.save();
      return next(
        new AppError(
          "there was an error while sending an email, try again later",
          500
        )
      );
    }
  }
);

// ________________________________________________________________________________

const resetPassword = escortAsync<
  RequestHandler<any, any, { password: string; confirmPassword: string }>
>(async function (req, res, next) {
  const { password, confirmPassword } = req.body;
  const resetToken = req.params.token;
  const hashedResetToken = hashPasswordResetToken(resetToken);

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("token is invalid or has expired ", 400));

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetExpires = user.passwordResetToken = undefined;
  await user.save();

  const secretKey = getSecretKey(next) as string;
  const token = signToken(user._id, secretKey);

  sendToken(res, token);
});

// ________________________________________________________________________________

const updatePassword = escortAsync<
  RequestHandler<any, any, updatePasswordData>
>(async function (req, res, next) {
  const secretKey = getSecretKey(next) as string;

  const user = await User.findById(
    (req as unknown as { user: { id: string } }).user.id
  ).select("+password");
  if (!user) return next(new AppError("user doesn't exists", 404));

  const { currentPassword, confirmNewPassword, newPassword } = req.body;
  if (!newPassword || !currentPassword)
    return next(new AppError("please send password"));

  if (!(await user.validatePassword(currentPassword, user.password)))
    return next(new AppError("password is incorrect"));

  user.confirmPassword = confirmNewPassword;
  user.password = newPassword;
  
  user.save();

  const token = signToken(user._id, secretKey);

  user.set("password", undefined);
  sendToken(res, token, user);
});

export {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
