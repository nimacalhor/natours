import Tour from "../models/tour";
import AppError, { escortAsync } from "../modules/errors";
import { getSuccessJsend, getQueryString } from "../modules/general/utils";
import { TOUR_PER_PAGE } from "../modules/general";
import { createOne, deleteOne, updateOne } from "./handlerFactory";
import {
  applyPagination,
  limitDocumentsFields,
  sortDocuments,
} from "../modules/general/query-features";

import type { GetToursQueries, Tour as ITour } from "../types";
import type { RequestHandler } from "express";
import type { HydratedDocument, Query } from "mongoose";

const getAllTours: RequestHandler = escortAsync<
  RequestHandler<any, any, any, GetToursQueries>
>(async (req, res) => {
  const { fields, page, limit, sort, ...queryObj } = req.query;

  const queryString = getQueryString(queryObj);
  let query: Query<any, HydratedDocument<ITour>> = Tour.find(
    JSON.parse(queryString)
  );

  query = sortDocuments<ITour>(query, sort, "-createdAt");
  query = limitDocumentsFields<ITour>(query, fields);
  query = await applyPagination<ITour>(
    query,
    Tour,
    Number(page),
    Number(limit) || TOUR_PER_PAGE
  );

  const tours = await query;

  res.status(200).json(getSuccessJsend({ tours }, tours.length));
});

const createTour = createOne<ITour>(Tour);

const getTour: RequestHandler = escortAsync<RequestHandler>(
  async (req, res, next) => {
    const id = req.params.id || null;
    const tour = await Tour.findById(id).populate("guides");

    if (!tour) return next(new AppError("could not found the tour", 404));
    res.status(200).json(getSuccessJsend({ tour }));
  }
);

const updateTour = updateOne<ITour>(Tour);

const deleteTour = deleteOne<ITour>(Tour);

const aliasTopTour: RequestHandler = escortAsync<
  RequestHandler<any, any, any, GetToursQueries>
>(async (req, res, next) => {
  req.query = {
    ...req.query,
    sort: "-ratingsAverage,price",
    limit: "5",
  };
  next();
});

const getToursStats: RequestHandler = escortAsync<RequestHandler>(
  async (req, res) => {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {
            $gt: 4.5,
          },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          numRatings: { $sum: "$ratingsQuantity" },
          avgRatings: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);
    res.status(200).json(getSuccessJsend({ stats }));
  }
);

const getMonthlyPlan: RequestHandler = escortAsync<RequestHandler>(
  async (req, res) => {
    const year = Number(req.params.year);
    const plans = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTours: { $sum: 1 },
          tours: { $push: { _id: "$_id", name: "$name" } },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    res.status(200).json(getSuccessJsend({ plans }, plans.length));
  }
);

export {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTour,
  getToursStats,
  getMonthlyPlan,
};
