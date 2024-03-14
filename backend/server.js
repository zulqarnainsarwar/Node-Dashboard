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
  category: String,
  price: String,
  quantity: Number,
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
//Send Data
app.post("/records", async (req, res) => {
  try {
    const { name, phone, email, category, price, quantity } = req.body;
    // Create a new record
    const newRecord = new Record({
      name,
      phone,
      email,
      category,
      price,
      quantity,
    });
    // Save the new record to the database
    await newRecord.save();
    res.status(200).json({ message: "Record added successfully" });
  } catch (error) {
    console.error("Error adding record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Update Data
app.put("/records/:recordId", async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const { name, phone, email, category, price, quantity } = req.body;
    const updatedRecord = await Record.findByIdAndUpdate(
      recordId,
      { name, phone, email, category, price, quantity },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//delete Data
app.delete("/records/:recordId", async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const { name, phone, email, category, price, quantity } = req.body;
    const DeleteRecord = await Record.findByIdAndDelete(
      recordId,
      { name, phone, email, category, price, quantity },
      { new: true }
    );

    if (!DeleteRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(200).json(DeleteRecord);
  } catch (error) {
    console.error("Error updating record:", error);
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
