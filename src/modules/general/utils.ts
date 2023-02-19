import { BASE_PATH } from "./constants";
import { FailJsend, SuccessJsend } from "../../types/general-types";

const getEndPoint = (endPoint: string) => `${BASE_PATH}${endPoint}`;

/**
 * for sending better json (Jsend) to client
 * @param data any
 * @param total_results number
 * @returns response to client
 */
const getSuccessJsend = (data: any, total_results?: number): SuccessJsend => {
  const res: SuccessJsend = { status: "success", data };
  if (total_results) res.total_results = total_results;
  return res;
};

/**
 * for sending better json (Jsend) to client
 * @param data any
 * @param total_results number
 * @returns response to client
 */
const getFailedJsend = (
  status: "error" | "fail",
  data: any,
  error?: string[]
): SuccessJsend => {
  const res: FailJsend = { status, data };
  if (error) res.error = error;
  return res;
};

/**
 * set query object to mongoose query string by adding $
 * to the beginning of mongoose operators : ge => $gt
 * @param queryObj {Object}
 * @param regex {Regex} @default /\b(gt|gte|lt|lte)\b/g
 * @returns query string
 */
const getQueryString = (
  queryObj: any,
  regex: RegExp = /\b(gt|gte|lt|lte)\b/g
) => JSON.stringify(queryObj).replace(regex, (match) => `$${match}`);

export { getEndPoint, getSuccessJsend, getFailedJsend, getQueryString };
