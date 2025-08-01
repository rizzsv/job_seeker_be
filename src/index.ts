import express from "express";
import chalk from 'chalk';
import dotenv from "dotenv";
import cors from "cors"
import { connectDb } from "./config/db";
import { globalErrorHandler } from "./middleware/error.middleware"

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

// Apply Error Middleware
app.use(globalErrorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(chalk.bold.blueBright(`
   ⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
  `));
  console.log(chalk.greenBright(`  🚀 Server is up and running!`));
  console.log(chalk.yellow(`  🔥 Listening on: `) + chalk.underline.cyan(`http://localhost:${PORT}`));
  console.log(chalk.magentaBright(`  📦 Ready to serve your greatness`));
  console.log(chalk.blue(`  🧠 Stay sharp, dev warrior 💻`));
  console.log(chalk.bold.blueBright(`
   ⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
  `));
});
