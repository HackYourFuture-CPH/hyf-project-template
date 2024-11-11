import express from "express";
import DeveloperController from "../../controllers/developerController.js";

const devRouter = express.Router();

devRouter.get("/", (req, res) => {
  res.json({ message: "Hello from devRouter" });
});

// Route to get developers for a specific project
devRouter.get("/project/:pjId", DeveloperController.getDevelopersForProject);

devRouter.post("/assign", DeveloperController.assignDeveloper);

// Route to remove a developer from a specific project
devRouter.delete("/:pjId/devs/:devId", DeveloperController.removeDeveloper);

devRouter.get("/allClients", DeveloperController.getClients);

devRouter.get("/allDevelopers", DeveloperController.getAllDevelopers);

devRouter.get("/client/:pjId", DeveloperController.getProjectClient);

export default devRouter;
