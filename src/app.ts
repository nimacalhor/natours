import express from "express";
import toursRouter from "./routes/toursRouter";
import usersRouter from "./routes/usersRouter";
import reviewsRouter from "./routes/reviewRouter";
import globalErrorHandler from "./controllers/errorsController";
import morgan from "morgan";
import limiter from "./modules/general/rateLimiter";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { getEndPoint } from "./modules/general/utils";
import { HPP_WITH_LIST } from "./modules/general";

const xss = require("xss-clean");

// it adds some methods to the app variable
const app = express();

// middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(`${__dirname}/../public`));
app.use("/api", limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: HPP_WITH_LIST,
  })
);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(getEndPoint("tours"), toursRouter);
app.use(getEndPoint("users"), usersRouter);
app.use(getEndPoint("reviews"), reviewsRouter);
app.use(globalErrorHandler);

export default app;
