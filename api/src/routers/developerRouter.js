import express from "express";
import DeveloperController from "../../controllers/developerController.js";

const devRouter = express.Router();

devRouter.get("/", (req, res) => {
  res.json({ message: "Hello from devRouter" });
});

// Route to get all clients
devRouter.get("/allClients", DeveloperController.getClients);
// Route to get all developers
devRouter.get("/allDevelopers", DeveloperController.getAllDevelopers);

// Route to get developers of a specific project
devRouter.get("/project/:PJid", DeveloperController.getDevelopersForProject);

// Route to assign a developer from a specific project
devRouter.post("/assign", DeveloperController.assignDeveloper);

// Route to remove a developer from a specific project
devRouter.delete("/:DEVid/project/:PJid", DeveloperController.removeDeveloper);

export default devRouter;
