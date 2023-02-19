import { Model } from "mongoose";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  photo: string;
  password: string;
  active: boolean;
  confirmPassword?: string;
  changedPasswordAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export interface UserMethods {
  validatePassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  validateTokenAndChangedPassword: (jwtTimeStamp?: number) => boolean;
  createResetPasswordToken: () => string;
}

export type UserModel = Model<User, {}, UserMethods>;

export type UserRoles = "admin" | "user" | " guid" | "lead-guide";

export interface UpdateMeData extends User {}
