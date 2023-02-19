import mongoose from "mongoose";

import type { Location, Tour } from "../../types";
import type { Model } from "mongoose";

const locationSchema = new mongoose.Schema<Location>({
  description: {
    type: String,
  },
  type: {
    type: String,
    default: "Point",
    enum: ["Point"],
  },
  coordinates: {
    type: [Number],
  },
  day: {
    type: Number,
  },
});

const tourSchema = new mongoose.Schema<Tour, Model<Tour>>({
  ratingsAverage: {
    type: Number,
  },
  ratingsQuantity: {
    type: Number,
  },
  images: {
    type: [String],
  },
  startDates: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (this: Tour, value: Number) {
        return value < this.price;
      },
    },
  },
  summary: {
    type: String,
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
  },
  slug: {
    type: String,
  },

  // Location ______________________________
  locations: {
    type: [locationSchema],
    required: true,
  },
  startLocation: {
    description: {
      type: String,
    },
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
    address: {
      type: String,
    },
  },

  // tour guid ______________________________
  guides: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

export default tourSchema;
