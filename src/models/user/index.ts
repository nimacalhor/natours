import userSchema from "./schema";
import mongoose from "mongoose";

import type { User, UserModel, UserMethods } from "../../types";

export default mongoose.model<User, UserModel>("User", userSchema);
