import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many requests from this IP, please try again in an hour",
});

export default limiter;
