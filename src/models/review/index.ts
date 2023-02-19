import mongoose from "mongoose";
import { Review, ReviewModel } from "../../types";
import reviewSchema from "./schema";

export default mongoose.model<Review, ReviewModel>("Review", reviewSchema);
