import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import prisma from "./lib/prisma.js";
dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:5173"],
  Credentials: true,
};
app.use(cors(corsOptions));

app.all(
  "/api/auth/{*any}",

  toNodeHandler(auth)
);

const PORT: number = 3000;

app.listen(PORT, () => console.log("App is listing on port", PORT));

app.get("/", (req: Request, res: Response) => {
  res.send("Ok working this ");
});


