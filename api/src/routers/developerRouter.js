import express from "express";
import DeveloperController from "../../controllers/developerController.js";

const devRouter = express.Router();

devRouter.get("/", (req, res) => {
  res.json({ message: "Hello from devRouter" });
});

devRouter.get("/allClients", DeveloperController.getClients);

devRouter.get("/allDevelopers", DeveloperController.getAllDevelopers);

// Route to get developers of a specific project
devRouter.get(
  "/project/:projectId",
  DeveloperController.getDevelopersForProject
);

// Route to assign a developer from a specific project
devRouter.post("/assignProject", DeveloperController.assignDeveloper);

// Route to remove a developer from a specific project
devRouter.delete(
  "/:developerId/project/:projectId",
  DeveloperController.removeDeveloper
);

devRouter.get(
  "/getAllProjectsFromDeveloper/:id",
  DeveloperController.getProjectsByDeveloperId
);

export default devRouter;
