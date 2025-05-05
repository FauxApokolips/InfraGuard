const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const { CloudWatchTransport } = require("winston-aws-cloudwatch");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new CloudWatchTransport({
      logGroupName: "InfraMonitoring",
      logStreamName: "AppLogs",
      awsRegion: "us-east-1",
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    }),
  ],
});

const InfraStatusSchema = new mongoose.Schema({
  name: String,
  status: String,
  updatedAt: { type: Date, default: Date.now }
});

const InfraStatus = mongoose.model("InfraStatus", InfraStatusSchema);

app.post("/api/infrastructure", async (req, res) => {
  try {
    const newInfra = new InfraStatus(req.body);
    await newInfra.save();
    logger.info("New infrastructure status added", { data: req.body });
    res.json({ message: "Infrastructure status added" });
  } catch (error) {
    logger.error("Error saving infrastructure status", { error: error.message });
    res.status(500).json({ message: "Error saving infrastructure status" });
  }
});

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message });
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});