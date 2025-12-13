import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:5173/"],
  Credential: true,
};

app.use(cors(corsOptions));

const PORT: number = 3000;

app.listen(PORT, () => console.log("App is listing on port", PORT));

app.get("/", (req: Request, res: Response) => {
  res.send("Ok working this ");
});


