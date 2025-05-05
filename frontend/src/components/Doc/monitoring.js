const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const InfraStatusSchema = new mongoose.Schema({
  name: String,
  status: String,
  updatedAt: { type: Date, default: Date.now }
});

const InfraStatus = mongoose.model("InfraStatus", InfraStatusSchema);

io.on("connection", (socket) => {
  console.log("New client connected");

  const sendUpdates = async () => {
    const infraStatus = await InfraStatus.find();
    socket.emit("infraUpdate", infraStatus);
  };
  
  sendUpdates();

  const interval = setInterval(sendUpdates, 5000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

app.post("/api/infrastructure", async (req, res) => {
  const newInfra = new InfraStatus(req.body);
  await newInfra.save();
  io.emit("infraUpdate", await InfraStatus.find());
  res.json({ message: "Infrastructure status added" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
