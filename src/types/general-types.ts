import type { RequestHandler } from "express";
import type { CastError, MongooseError } from "mongoose";
import type { Location } from "./tours-types";

export type StatusMessage = "success" | "fail" | "error";
export interface Jsend {
  status: StatusMessage;
  data: any | null;
}
export interface SuccessJsend extends Jsend {
  total_results?: number;
}
export interface FailJsend extends Jsend {
  error?: string[];
}

export interface GeneralQueries {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
}

export interface GetToursQueries extends GeneralQueries {
  ratingsAverage?: string;
  name?: string;
  duration?: string;
  maxGroupSize?: string;
  difficulty?: string;
  price?: string;
  locations?: Location[];
}

export type KeyOperators = "gte" | "gt" | "lt" | "lte";
export enum KeyOperatorsEnum {
  gte = "gte",
  gt = "gt",
  lt = "lt",
  lte = "lte",
}

export interface OptError {
  status: "error" | "fail";
  statusCode: number;
  name: string;
  message: string;
  stack?: string | undefined;
}

type HandlerFactoryMiddlewareArgs = Parameters<RequestHandler>;

export type HandlerFactoryMiddleware = (
  ...args: HandlerFactoryMiddlewareArgs
) => void | Promise<any>;
