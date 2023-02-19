process.on("uncaughtException", (err) => {
  console.log("uncaught exceptions");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

import dotenv from "dotenv";
dotenv.config({
  path: `${__dirname}/../config.env`,
});

import app from "./app";
import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_LOCAL_CONNECTION_STRING || "", {
      autoIndex: true,
    });
    console.log("database connected successfully ✔");
  } catch (error) {
    console.log("error while connecting to database", error);
  }
}
connectDB();

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`server is running on port ${process.env.PORT || 3000} 🏃‍♀️`);
});

process.on("unhandledRejection", (err: any) => {
  console.log("Unhandled Rejection");
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
