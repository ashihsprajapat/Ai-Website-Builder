import express from "express";
import { Protect } from "../Middlewares/auth.js";
import {
  createUserProject,
  getUserProject,
  getUserProjects,
  purchessCredits,
  togglePublish,
  userCredist,
} from "../Controllers/User.controller.js";

const userRouter = express.Router();
userRouter.get("/credits", Protect, userCredist);

userRouter.get("/project/:projectId", Protect, getUserProject);

userRouter.post("/project", Protect, createUserProject);

userRouter.get("/projects", Protect, getUserProjects);

userRouter.put("/publish-toggle/:projectId", Protect, togglePublish);

userRouter.post("/purchase-credits", Protect, purchessCredits);

export default userRouter;
