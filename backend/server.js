const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const createError = require("http-errors");
const cors = require("cors");

const app = express();

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Mongodb Connected...");
  })
  .catch((err) => console.log(err));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const recordSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
});
const Record = mongoose.model("Record", recordSchema);
app.get("/records", async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//404 handler and pass to error handler
app.use((req, res, next) => {
  next(createError(404, "Not found"));
});
// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
const PORT = 3002;
app.listen(PORT, () => {
  console.log("Server use Port " + PORT + "....");
});
