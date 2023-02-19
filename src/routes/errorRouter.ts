import app from "../app";
import AppError from "../modules/errors/app-error";

app.all("*", (req, res, next) =>
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404))
);
