// src/server/index.ts
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import iappRouter from "./api/iapp";
import telegramRouter from "../../backend/routes/telegram.routes";
import bodyParser from "body-parser";
import path from "path";

const app = express();
app.use(bodyParser.json());

app.use("/api/iapp", iappRouter);
app.use("/api/telegram", telegramRouter);

// optionally serve static frontend build if exist
const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
