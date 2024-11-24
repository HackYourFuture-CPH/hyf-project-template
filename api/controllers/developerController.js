import ProjectDeveloperService from "../services/projectDeveloperService.js";

class DeveloperController {
  static async getAllDevelopers(req, res) {
    try {
      const developers = await ProjectDeveloperService.getAllDevelopers();
      res.status(200).json(developers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getClients(req, res) {
    try {
      const allClients = await ProjectDeveloperService.getAllClients();
      res.status(200).json(allClients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getDevelopersForProject(req, res) {
    const { projectId: projectId } = req.params;
    try {
      const developers =
        await ProjectDeveloperService.getDevelopersForProject(projectId);
      res.status(200).json(developers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async assignDeveloper(req, res) {
    const { projectId, developerId } = req.body;
    try {
      const result = await ProjectDeveloperService.assignDeveloperToProject(
        projectId,
        developerId
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeDeveloper(req, res) {
    const { projectId: projectId, developerId: developerId } = req.params;
    try {
      const result = await ProjectDeveloperService.removeDeveloperFromProject(
        projectId,
        developerId
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getProjectsByDeveloperId(req, res) {
    try {
      const projects = await ProjectDeveloperService.getProjectsByDeveloperId(
        req.params.id
      );
      res.status(200).json(projects);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
export default DeveloperController;
