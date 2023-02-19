import tourSchema from "./schema";

tourSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "tour",
  localField: "_id",
});
