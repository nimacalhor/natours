const dotenv = require("dotenv")
const mongoose = require("mongoose")
const fs = require("fs")
const { default: Tour } = require("../../dist/models/tourModel")

dotenv.config({ path: `${__dirname}/../../config.env` });


(async () => {
  try {
    await mongoose.connect(process.env.DB_LOCAL_CONNECTION_STRING || "");
    console.log("db connected")
  } catch (err) {
    console.log(err.message)
  }
})();

const tours = JSON.parse(
  fs.readFileSync(__dirname + "/../../dev-data/data/tours.json", "utf-8")
);

const importData = async function () {
  try {
    await Tour.create(tours);
    console.log("all data imported 🟢");
  } catch (err) {
    console.log("import Data failed", err.message);
  }
  process.exit()
};
const deleteAllData = async function () {
  console.log("Tour", Tour)
  try {
    await Tour.deleteMany();
    console.log("all data deleted 🟢");
  } catch (err) {
    console.log("deleting Data failed", err.message);
  }
  process.exit()
};

if (process.argv[2] === "--import") importData();
else if (process.argv[2] === "--delete") deleteAllData();

console.log(process.argv);
