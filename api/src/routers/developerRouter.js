import express from "express";
import DeveloperController from "../../controllers/developerController.js";

const devRouter = express.Router();

devRouter.get("/", (req, res) => {
  res.json({ message: "Hello from devRouter" });
});
devRouter.get("/allClients", DeveloperController.getClients);

devRouter.get("/allDevelopers", DeveloperController.getAllDevelopers);

// Route to get developers for a specific project
devRouter.get("/project/:PJid", DeveloperController.getDevelopersForProject);

devRouter.post("/assign", DeveloperController.assignDeveloper);

// Route to remove a developer from a specific project
devRouter.delete("/:PJid/devs/:DEVid", DeveloperController.removeDeveloper);

export default devRouter;
