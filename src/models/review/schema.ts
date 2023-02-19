import mongoose from "mongoose";

import type { ReviewModel, Review } from "../../types";

const reviewSchema = new mongoose.Schema<Review, ReviewModel>(
  {
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 3,
    },
    review: {
      type: String,
      maxlength: 200,
      required: [true, "Review must contain text"],
    },
    tour: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
      required: [true, "review must belong to a tour"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default reviewSchema;
