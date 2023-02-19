import tourSchema from "./schema";

import AppError from "../../modules/errors";
import slugify from "slugify";

import type { PreMiddlewareFunction, HydratedDocument } from "mongoose";
import type { Tour } from "../../types";

/**
 * adds slug path to every tour document before first save
 * @param next mongoose NextFunction
 * @returns
 */
const addSlugPath: PreMiddlewareFunction<Tour> = function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  else
    return next(new AppError('new document must contain "name" property', 400));
  next();
};

/**
 * populates tour guides data in tour documents
 * @param next mongoose NextFunction
 */
const populateTourGuides: PreMiddlewareFunction<HydratedDocument<Tour>> =
  function (next) {
    this.populate({
      path: "guides",
      select: "-__v -passwordChangedAt",
    });
  };

tourSchema.pre("save", addSlugPath);
tourSchema.pre(/^find/, populateTourGuides);
