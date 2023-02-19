const BASE_PATH = "/api/v1/";
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING?.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD || ""
);
const TOUR_PER_PAGE = 10;
const HPP_WITH_LIST = [
  "duration",
  "ratingsQuantity",
  "ratingsAverage",
  "maxGroupSize",
  "difficultly",
  "price",
];

export { BASE_PATH, DB_CONNECTION_STRING, TOUR_PER_PAGE, HPP_WITH_LIST };
