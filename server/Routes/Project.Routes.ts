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

projcetRouter.put("/save/:projectId", Protect, saveProjectCode);

projcetRouter.get(
  "/rollback/:projectId/:versionId",
  Protect,
  rollbackToVersion
);

projcetRouter.delete("/:projectId", Protect, deleteProject);

projcetRouter.get("/preview/:projectId", Protect, getProjectPreview);

projcetRouter.get("/publish", getPublisProject);

projcetRouter.get("/publish/:projectId", getProjectById);

