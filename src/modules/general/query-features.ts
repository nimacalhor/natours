import { HydratedDocument, Model, Query } from "mongoose";
import { TOUR_PER_PAGE } from "./constants";

/**
 * sort documents
 * ascending: &sort=price
 * descending: &sort=-price
 * sort by multiple criteria : query.sort("path title averageRatings")
 * @param query mongoose Query
 * @param sort paths to sort by separated by ","
 * @param defaultSorting path name to sort by if no path were in query object
 * @param T data interface like User Tour Review
 * @returns mongoose  Query
 */
const sortDocuments = function <T>(
  query: Query<any, HydratedDocument<T>>,
  sort?: string,
  defaultSorting?: string
): Query<any, HydratedDocument<T>> {
  let newQuery = query;
  if (sort) newQuery = query.sort(sort.split(",").join(" "));
  else newQuery = query.sort(defaultSorting);
  return newQuery;
};

/**
 * limit fields of each document
 *  for not including fields but not deleting them we use -
 .select("key something -title")
 we can hide fields from schema using select key
 * @param query mongoose Query
 * @param fields {string} fields to save separated by "," : "price,name,description"
 * @param T type of data like : User Tour ...
 * @returns Query
 */
const limitDocumentsFields = function <T>(
  query: Query<any, HydratedDocument<T>>,
  fields?: string
): Query<any, HydratedDocument<T>> {
  let newQuery = query;
  if (fields) newQuery = query.select(fields.split(",").join(" "));
  return newQuery;
};
/**
 * apply pagination and result limiting
 * @param T the data interface like User Tour
 * @param query mongoose Query
 * @param model the data model like User Tour
 * @param page number of page @default 1
 * @param limit number document for each result @default TOUR_PER_PAGE
 * @returns {Promise<Query>} mongoose Query
 */
const applyPagination = async function <T>(
  query: Query<any, HydratedDocument<T>>,
  model: Model<T>,
  page: number = 1,
  limit: number = TOUR_PER_PAGE
): Promise<Query<any, HydratedDocument<T>>> {
  let newQuery = query;
  const skip = (page - 1) * limit;
  const numDocs = await model.countDocuments();

  if (skip >= numDocs) throw new Error("no documents were found, last page");
  newQuery = query.skip(skip).limit(limit || TOUR_PER_PAGE);
  return newQuery;
};

export { sortDocuments, limitDocumentsFields, applyPagination };
