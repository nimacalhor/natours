import type { Model, ObjectId } from "mongoose";

export interface Review {
  _id: ObjectId;
  review: string;
  rating: number;
  user: ObjectId;
  tour: ObjectId;
  createdAt: Date;
}

export interface GetAllReviewsReqQueries {
  fields?: string;
  page?: string;
  sort?: string;
  limit?: string;
  review?: string;
  rating?: string;
  user?: ObjectId;
  tour?: ObjectId;
  createdAt?: Date;
}

export interface CreateReviewReqBody {
  user: ObjectId;
  tour: ObjectId;
  review: string;
}

export type ReviewModel = Model<Review>;
