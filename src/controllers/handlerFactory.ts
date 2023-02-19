import AppError from "../modules/errors/app-error";
import { escortAsync } from "../modules/errors";
import { getSuccessJsend } from "../modules/general";

import type {
  HydratedDocument,
  Model,
  UpdateQuery,
  QueryOptions,
  SaveOptions,
} from "mongoose";
import type { RequestHandler } from "express";

/**
 * returns RequestHandler function for deleting one document. returned function is escorted
 *
 * @param t.T data Interface (User Tour ...)
 * @param t.ReqBody type of request body
 * @param t.ReqQuery type of Request query
 * @param model mongoose Model
 * @returns RequestHandler
 */
const deleteOne = function <T extends {}, ReqBody = any, ReqQuery = any>(
  Model: Model<T>
) {
  return escortAsync<RequestHandler<any, any, ReqBody, ReqQuery>>(
    async function (req, res, next) {
      const docId = req.params.id || null;
      const doc = await Model.findByIdAndDelete(docId);

      if (!doc)
        return next(new AppError(`no ${Model.name} found with that id`, 404));

      res.status(204).json(getSuccessJsend({ [Model.name]: null }));
    }
  );
};

/**
 * return RequestHandler function for updating documents
 * @param t.T data Interface (User Tour ...)
 * @param t.ReqBody type of request body
 * @param t.ReqQuery type of Request qu
 * @param Model mongoose Model
 * @param updateOptions findByIdAndUpdate options
 * @default {runValidators: true}
 * @returns RequestHandler
 */
const updateOne = function <T extends {}, ReqBody = {}, ReqQuery = any>(
  Model: Model<T>,
  updateOptions: QueryOptions<T> = { runValidators: true }
) {
  return escortAsync<
    RequestHandler<any, any, UpdateQuery<T> & ReqBody, ReqQuery>
  >(async function (req, res, next) {
    const docId = req.params.id || null;
    const doc = await Model.findByIdAndUpdate<HydratedDocument<T>>(
      docId,
      req.body,
      {
        ...updateOptions,
        new: true,
      }
    );

    if (!doc) return next(new AppError(`no ${Model.name} found`, 404));

    res.status(202).json(getSuccessJsend({ [`new${Model.name}`]: doc }));
  });
};

/**
 * return RequestHandler function for creating documents
 * @param t.T data Interface (User Tour ...)
 * @param t.ReqBody type of request body
 * @param t.ReqQuery type of Request qu
 * @param Model mongoose Model
 * @param createOptions create options
 * @default { validateBeforeSave: true }
 * @returns RequestHandler
 */
const createOne = function <T extends {}, ReqBody = T, ReqQuery = any>(
  Model: Model<T>,
  createOptions: SaveOptions = { validateBeforeSave: true }
) {
  return escortAsync<RequestHandler<any, any, ReqBody, ReqQuery>>(
    async function (req, res, next) {
      const doc = req.body;
      const [createdDoc] = await Model.create([doc], createOptions);
      res
        .status(201)
        .json(getSuccessJsend({ [`new${Model.name}`]: createdDoc }));
    }
  );
};

export { deleteOne, updateOne, createOne };
