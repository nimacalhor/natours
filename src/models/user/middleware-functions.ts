import { hash } from "bcrypt";

import type {
  PreMiddlewareFunction,
  PreSaveMiddlewareFunction,
  HydratedDocument,
  Query,
} from "mongoose";
import type { User } from "../../types";
import userSchema from "./schema";

/**
 * hashes User password before save and removes confirm password
 * @param next mongoose NextFunction
 *
 */
const hashUserPassword: PreSaveMiddlewareFunction<HydratedDocument<User>> =
  async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
  };

/**
 * if password was modified this function will set the documents changedPasswordAt property
 * @param next mongoose NextFunction`
 *
 */
const controlChangedPasswordAt: PreSaveMiddlewareFunction<
  HydratedDocument<User>
> = function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.changedPasswordAt = new Date(Date.now() - 5000);
  next();
};

/**
 * filters users for active : true
 * @param next mongoose NextFunction
 */
const getOnlyActiveUsers: PreMiddlewareFunction<
  Query<any, HydratedDocument<User>>
> = async function (next) {
  this.find({ active: { $ne: false } });
  next();
};

userSchema.pre("save", hashUserPassword);

userSchema.pre("save", controlChangedPasswordAt);

userSchema.pre(/^find/, getOnlyActiveUsers);
