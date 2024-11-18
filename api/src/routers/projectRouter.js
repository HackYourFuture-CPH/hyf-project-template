import express from "express";

import ProjectController from "../../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.get("/", ProjectController.getAllProjects);

projectRouter.get("/:id", ProjectController.getProjectById);

//get all projects from that developer:
// projectRouter.get("/developer/:id", ProjectController.getProjectByDeveloperId);

projectRouter.get("/client/:id", ProjectController.getProjectsByClientId);

projectRouter.post("/create", ProjectController.createProject);

projectRouter.post("/:id", ProjectController.updateProject);

projectRouter.delete("/:id", ProjectController.deleteProject);

export default projectRouter;
