import express from "express";

import ProjectController from "../../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.get("/", ProjectController.getAllProjects);

projectRouter.get("/:id", ProjectController.getProjectById);

projectRouter.get("/client/:id", ProjectController.getProjectsByClientId);

projectRouter.post("/create", ProjectController.createProject);

projectRouter.post("/:id", ProjectController.updateProject);

projectRouter.delete("/:id", ProjectController.deleteProject);

export default projectRouter;
