import mongoose from "mongoose";
import validator from "validator";
import { UserRoles } from "../../modules/users";

import type { User, UserModel, UserMethods } from "../../types";

const userSchema = new mongoose.Schema<User, UserModel, UserMethods>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxLength: 12,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "email is not valid",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (this: User, val: string) {
        return val === this.password;
      },
      message: "confirmPassword is not the same as password.",
    },
    select: false,
  },
  role: {
    type: String,
    enum: [...Object.values(UserRoles)] as string[],
    default: UserRoles.user,
  },
  photo: String,
  changedPasswordAt: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  active: { type: Boolean, select: false, default: true },
});

export default userSchema;
