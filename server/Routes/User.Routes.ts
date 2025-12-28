import express, { Request, Response, NextFunction } from "express";
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

//get credits of project
userRouter.get("/credits", Protect, userCredist);

// get project by project id
userRouter.get("/project/:projectId", Protect, getUserProject);

//create project
userRouter.post("/project", Protect, createUserProject);

//get all projects created by user
userRouter.get("/projects", Protect, getUserProjects);

//can change public and private  the project
userRouter.put("/publish-toggle/:projectId", Protect, togglePublish);

//purchase-credits
userRouter.post("/purchase-credits", Protect, purchessCredits);

export default userRouter;
