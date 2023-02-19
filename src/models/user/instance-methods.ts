import userSchema from "./schema";

import {
  RESET_TOKEN_EXPIRATION_TIME,
  getPasswordResetToken,
  hashPasswordResetToken,
} from "../../modules/auth";
import { compare } from "bcrypt";

import type { HydratedDocument } from "mongoose";
import type { User } from "../../types";

/**
 * compares if raw received password is equal to saved hashed password in database
 * @param candidatePassword raw password from user whom requested to be login
 * @param userPassword saved hashed password in database
 * @returns {Promise<boolean}
 */
userSchema.methods.validatePassword = async (
  candidatePassword: string,
  userPassword: string
) => await compare(candidatePassword, userPassword);

/**
 * checks jwt validation by checking if jwt was issued after user changed his password.
 * false means not changed.
 * password changed date must be less than jwt creation date
 * @this UserDocument
 * @param jwtTokenCreationDate
 * @returns boolean
 */
userSchema.methods.validateTokenAndChangedPassword = function (
  this: HydratedDocument<User>,
  jwtTokenCreationDate?: number
) {
  if (!this.changedPasswordAt || !jwtTokenCreationDate) return false;

  const changedPasswordDate = parseInt(
    (this.changedPasswordAt.getTime() / 100).toString(),
    10
  );

  if (changedPasswordDate > jwtTokenCreationDate) return true;
  else return false;
};

/**
 * sets user document "passwordResetToken" and "passwordResetToken" and generates reset token
 * @this User
 * @returns resetToken
 */
userSchema.methods.createResetPasswordToken = function (this: User) {
  const resetToken = getPasswordResetToken();

  this.passwordResetToken = hashPasswordResetToken(resetToken);

  this.passwordResetExpires = new Date(
    Date.now() + RESET_TOKEN_EXPIRATION_TIME
  );

  return resetToken;
};
