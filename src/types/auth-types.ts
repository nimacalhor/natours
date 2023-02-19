import type { User } from "./users-types";

export interface LoginData {
  email?: string;
  password?: string;
}

export interface SignUpData extends User {}

export interface updatePasswordData {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
