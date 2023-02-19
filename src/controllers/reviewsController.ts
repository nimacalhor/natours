import Review from "../models/review";
import { escortAsync } from "../modules/errors";
import { getQueryString, getSuccessJsend } from "../modules/general";
import {
  applyPagination,
  limitDocumentsFields,
  sortDocuments,
} from "../modules/general/query-features";
import { deleteOne } from "./handlerFactory";

import type { RequestHandler } from "express";
import type {
  GetAllReviewsReqQueries,
  Review as IReview,
  CreateReviewReqBody,
  User,
} from "../types";
import type { ObjectId } from "mongoose";

const getAllReviews = escortAsync<
  RequestHandler<any, any, any, GetAllReviewsReqQueries>
>(async function (req, res, next) {
  const { fields, limit, page, sort, ...queryObject } = req.query;

  const tourIdQuery = req.params.tourId ? { tour: req.params.tourId } : {};

  const queryString = getQueryString(queryObject);

  let getAllQuery = Review.find({ ...JSON.parse(queryString), ...tourIdQuery });

  getAllQuery = sortDocuments<IReview>(getAllQuery, sort, "-createdAt");
  getAllQuery = limitDocumentsFields<IReview>(getAllQuery, fields);
  getAllQuery = await applyPagination<IReview>(
    getAllQuery,
    Review,
    page ? Number(page) : undefined,
    limit ? Number(limit) : undefined
  );

  const reviews = await getAllQuery;

  res.status(200).json(getSuccessJsend({ reviews }));
});

const createReview = escortAsync<RequestHandler<any, any, CreateReviewReqBody>>(
  async function (req, res, next) {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = (req as any).user._id as ObjectId;

    const [newReview] = await Review.create([req.body], {
      validateBeforeSave: true,
    });

    res.status(202).json(getSuccessJsend({ newReview }));
  }
);

const deleteReview = deleteOne<IReview>(Review);

export { getAllReviews, createReview, deleteReview };
