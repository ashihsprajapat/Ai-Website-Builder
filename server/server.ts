import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import prisma from "./lib/prisma.js";
import userRouter from "./Routes/User.Routes.js";
import projcetRouter from "./Routes/Project.Routes.js";
dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:5173"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

app.all(
  "/api/auth/{*any}",

  toNodeHandler(auth)
);

const PORT: number = 3000;

app.listen(PORT, () => console.log("App is listing on port", PORT));

app.get("/", (req: Request, res: Response) => {
  res.send("Ok working this ");
});

app.use("/api/user", userRouter);

app.use("/api/project", projcetRouter);
