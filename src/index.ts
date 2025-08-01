import express from "express";
import chalk from 'chalk';
import dotenv from "dotenv";
import cors from "cors"
import { connectDb } from "./config/db";
import { globalErrorHandler } from "./middleware/error.middleware"
import { ApiPublic } from "./App/Api.Public";

dotenv.config();
const app = express();
app.use(express.json());

connectDb()

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true,
}));

app.get("/", (_, res) => {
  res.send("API Running");
});

// Apply Public Api
app.use(ApiPublic)

// Apply Error Middleware
app.use(globalErrorHandler)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 BOOM! Server ignited on port ${PORT}. Let’s build something awesome!`));
