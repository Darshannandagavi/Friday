import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import chatRoutes from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";
import ttsRouter from "./routes/ttsRoutes.js";
import visionRoutes from "./routes/visionRoutes.js";
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/tts", ttsRouter);

app.use("/api/vision", visionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});





