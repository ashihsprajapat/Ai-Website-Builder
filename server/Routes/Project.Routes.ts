import express from "express";
import { Protect } from "../Middlewares/auth.js";
import {
  deleteProject,
  getProjectById,
  getProjectPreview,
  getPublisProject,
  makeRevision,
  rollbackToVersion,
  saveProjectCode,
} from "../Controllers/Project.controller.js";

const projcetRouter = express.Router();

projcetRouter.post("/revision/:projectId", Protect, makeRevision);

//make some changes
projcetRouter.put("/save/:projectId", Protect, saveProjectCode);

//get project by id nad also have a versionId
projcetRouter.get(
  "/rollback/:projectId/:versionId",
  Protect,
  rollbackToVersion
);

//delete project by id
projcetRouter.delete("/:projectId", Protect, deleteProject);

//get project preview created by user
projcetRouter.get("/preview/:projectId", Protect, getProjectPreview);

//get all publis projects for community
projcetRouter.get("/publish", getPublisProject);

//getprojectbyId
projcetRouter.get("/publish/:projectId", getProjectById);

export default projcetRouter;
